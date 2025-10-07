import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import { IEventPublisher } from '../../interfaces/event.publisher.interface';
import { IEventConsumer } from '../../interfaces/event.consumer.interface';
import { MessagingConfig } from '../../../../domain.types/events/provider.types';
import { Logger } from '../../../../common/logger';
import { IMessagingProvider } from '../../interfaces/messaging.povider.interface';
import { RabbitMqEventPublisher } from './rabbitmq.event.publisher';
import { RabbitMqEventConsumer } from './rabbitmq.event.consumer';
import { injectable } from 'tsyringe';
import { ConfigurationManager } from '../../../../config/configuration.manager';

@injectable()

export class RabbitMqMessagingProvider implements IMessagingProvider {
    
    private connection: amqp.ChannelModel | null = null;

    private channel: Channel | null = null;

    private config: MessagingConfig;

    private isInitialized: boolean = false;
  
    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }
        try {
            this.config = ConfigurationManager.MessagingConfig();
            const connectionString = process.env.RABBITMQ_CONNECTION_STRING;
                        
            this.connection = await amqp.connect(connectionString);
            this.channel = await this.connection.createChannel();
            
            this.connection.on('error', (err) => {
                Logger.instance().log(`RabbitMQ connection error: ${err.message}`);
            });
            
            this.connection.on('close', () => {
                Logger.instance().log('RabbitMQ connection closed');
                this.isInitialized = false;
            });
            
            this.connection.on('blocked', (reason) => {
                Logger.instance().log(`RabbitMQ connection blocked: ${reason}`);
            });
            
            this.connection.on('unblocked', () => {
                Logger.instance().log('RabbitMQ connection unblocked');
            });
            
            if (this.config.Events.DeadLetterQueue.Enabled) {
                await this.setupDeadLetterExchange();
            }
            
            this.isInitialized = true;
            await this.setupExchangeAndQueues();
            Logger.instance().log('RabbitMQ messaging provider initialized successfully');
            
        } catch (error) {
            Logger.instance().log(`Failed to initialize RabbitMQ: ${error.message}`);
        }
    }
    
    getPublisher(): IEventPublisher {
        this.ensureInitialized();
        return new RabbitMqEventPublisher(this.channel, this.config);
    }
    
    getConsumer(queueName: string): IEventConsumer {
        this.ensureInitialized();
        return new RabbitMqEventConsumer(queueName);
    }
   
    async createQueue(queueName: string, topicName?: string): Promise<void> {
        this.ensureInitialized();
        
        try {
            const exchangeName = topicName || process.env.TOPIC_NAME;
            
            const queueOptions: any = {
                durable    : true,
                autoDelete : false,
                exclusive  : false,
                arguments  : {}
            };
            
            if (this.config.Events.DeadLetterQueue.Enabled) {
                queueOptions.arguments = {
                    'x-dead-letter-exchange'    : `${exchangeName}-dlx`,
                    'x-dead-letter-routing-key' : queueName,
                    'x-max-retries'             : this.config.Events.DeadLetterQueue.MaxReceiveCount
                };
            }
            
            if (this.config.Events.MessageRetentionPeriod) {
                queueOptions.arguments['x-message-ttl'] = this.config.Events.MessageRetentionPeriod * 1000;
            }
            
            await this.channel!.assertQueue(queueName, queueOptions);
            
            if (exchangeName) {
                await this.channel!.bindQueue(queueName, exchangeName, '');
                Logger.instance().log(`Bound queue ${queueName} to exchange ${exchangeName}`);
            }
            
            Logger.instance().log(`Created RabbitMQ queue: ${queueName}`);
            
        } catch (error) {
            Logger.instance().log(`Error creating RabbitMQ queue: ${error.message}`);
            throw error;
        }
    }
  
    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
            
            this.isInitialized = false;
            Logger.instance().log('RabbitMQ connection closed gracefully');
            
        } catch (error) {
            Logger.instance().log(`Error closing RabbitMQ connection: ${error.message}`);
        }
    }
    
    private async setupDeadLetterExchange(): Promise<void> {
        const exchangeName = process.env.TOPIC_NAME;
        const dlxName = `${exchangeName}-dlx`;
        const dlqName = `${exchangeName}-dlq`;
        
        try {
            await this.channel!.assertExchange(dlxName, 'direct', {
                durable    : true,
                autoDelete : false
            });
            
            await this.channel!.assertQueue(dlqName, {
                durable    : true,
                autoDelete : false,
                arguments  : {
                    'x-message-ttl' : this.config.Events.MessageRetentionPeriod ?
                        this.config.Events.MessageRetentionPeriod * 1000 : 1209600000 // 14 days default
                }
            });
            
            Logger.instance().log(`Setup dead letter exchange: ${dlxName} and queue: ${dlqName}`);
            
        } catch (error) {
            Logger.instance().log(`Error setting up dead letter exchange: ${error.message}`);
            throw error;
        }
    }
    
    private ensureInitialized(): void {
        if (!this.isInitialized || !this.connection || !this.channel) {
            throw new Error('RabbitMQ provider not initialized. Call initialize() first.');
        }
    }

    private async setupExchangeAndQueues(): Promise<void> {
        try {
            const exchangeName = process.env.TOPIC_NAME;
            
            await this.channel!.assertExchange(exchangeName, 'fanout', {
                durable    : true,
                autoDelete : false,
                arguments  : {}
            });
            
            Logger.instance().log(`Created RabbitMQ exchange: ${exchangeName}`);
            
            const queueNames = this.getEventQueues();
            
            for (const queueName of queueNames) {
                await this.createQueue(queueName, exchangeName);
                Logger.instance().log(`Setup queue ${queueName} for user deletion events`);
            }
            
            Logger.instance().log(`All ${queueNames.length} queues bound to exchange ${exchangeName}`);
            
        } catch (error) {
            Logger.instance().log(`Error setting up exchange and queues: ${error.message}`);
            throw error;
        }
    }

    private getEventQueues(): string[] {
        let env = process.env.NODE_ENV;
        if (!env) {
            throw new Error('NODE_ENV is not set');
        }
        env = env === "development" || env === "dev" || env === "Development" || env === "Dev" ? "dev" : env;
        env = env === "production" || env === "prod" || env === "Production" || env === "Prod" ? "prod" : env;

        return [
            `bot-wrapper-${env}-queue`,
            `careplan-${env}-queue`,
            `followup-${env}-queue`
        ];
    }

}
