import { Channel, ConsumeMessage } from 'amqplib';
import * as amqp from 'amqplib';
import { IEventConsumer } from '../../interfaces/event.consumer.interface';
import { ConsumerOptions, EventMessage, EventType } from '../../../../domain.types/events/event.types';
import { MessagingConfig } from '../../../../domain.types/events/provider.types';
import { Logger } from '../../../../common/logger';
import { ConfigurationManager } from '../../../../config/configuration.manager';

export class RabbitMqEventConsumer implements IEventConsumer {
    
    private connection: amqp.ChannelModel | null = null;

    private channel: Channel | null = null;

    private isListening: boolean = false;

    private consumerTag: string | null = null;

    private pendingMessages: Map<string, ConsumeMessage> = new Map();
    
    private config: MessagingConfig  = ConfigurationManager.MessagingConfig();

    constructor(
        private queueName: string,
    ) {}
    
    private async initializeConnection(): Promise<void> {
        if (this.connection && this.channel) {
            return;
        }
        
        try {
            const connectionString = process.env.RABBITMQ_CONNECTION_STRING;
            
            this.connection = await amqp.connect(connectionString);
            this.channel = await this.connection.createChannel();
            
            this.connection.on('error', (err) => {
                Logger.instance().log(`Consumer connection error: ${err.message}`);
            });
            
            this.connection.on('close', () => {
                Logger.instance().log('Consumer connection closed');
                this.isListening = false;
                this.connection = null;
                this.channel = null;
            });
            
            this.connection.on('blocked', (reason) => {
                Logger.instance().log(`Consumer connection blocked: ${reason}`);
            });
            
            this.connection.on('unblocked', () => {
                Logger.instance().log('Consumer connection unblocked');
            });
            
            Logger.instance().log(`Consumer initialized connection for queue: ${this.queueName}`);
            
        } catch (error) {
            Logger.instance().log(`Failed to initialize consumer connection: ${error.message}`);
            throw error;
        }
    }
    
    async startListening(): Promise<void> {
        if (this.isListening) {
            Logger.instance().log(`Consumer for ${this.queueName} already listening`);
            return;
        }
        
        try {
            await this.initializeConnection();
            
            await this.channel!.prefetch(1);
            const result = await this.channel!.consume(
                this.queueName,
                (msg) => this.handleMessage(msg),
                {
                    noAck    : false,
                    priority : 0
                }
            );
            
            this.consumerTag = result.consumerTag;
            this.isListening = true;
            
            Logger.instance().log(`Started consuming events from existing queue: ${this.queueName}`);
            
        } catch (error) {
            Logger.instance().log(`Error starting consumer for ${this.queueName}: ${error.message}`);
            throw error;
        }
    }
    
    async stopListening(): Promise<void> {
        if (!this.isListening) {
            return;
        }
        
        try {
            if (this.consumerTag && this.channel) {
                await this.channel.cancel(this.consumerTag);
                this.consumerTag = null;
            }
            
            this.isListening = false;
            
            Logger.instance().log(`Stopped consuming events from queue: ${this.queueName}`);
            
        } catch (error) {
            Logger.instance().log(`Error stopping consumer for ${this.queueName}: ${error.message}`);
        }
    }
    
    async close(): Promise<void> {
        try {
            await this.stopListening();
            
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
            
            Logger.instance().log(`Consumer connection closed for queue: ${this.queueName}`);
            
        } catch (error) {
            Logger.instance().log(`Error closing consumer connection: ${error.message}`);
        }
    }
    
    async acknowledgeMessage(messageId: string): Promise<void> {
        const msg = this.pendingMessages.get(messageId);
        if (msg && this.channel) {
            this.channel.ack(msg);
            this.pendingMessages.delete(messageId);
        }
    }
    
    async rejectMessage(messageId: string, requeue: boolean = false): Promise<void> {
        const msg = this.pendingMessages.get(messageId);
        if (msg && this.channel) {
            this.channel.nack(msg, false, requeue);
            this.pendingMessages.delete(messageId);
        }
    }
    
    private async handleMessage(msg: ConsumeMessage | null, options?: ConsumerOptions): Promise<void> {
        if (!msg) {
            return;
        }
        
        try {
            const eventMessage: EventMessage = JSON.parse(msg.content.toString());
            const eventType = eventMessage.EventType;
            
            if (!options?.AutoAck) {
                this.pendingMessages.set(eventMessage.EventId, msg);
            }
            
            Logger.instance().log(`Received ${eventType} event ${eventMessage.EventId} on queue ${this.queueName}`);
            
            try {
                await this.routeEventToHandler(eventMessage);
                Logger.instance().log(`Processed ${eventType} event ${eventMessage.EventId} successfully`);
            } catch (handlerError) {
                Logger.instance().log(`Handler error for ${eventType} event ${eventMessage.EventId}: ${handlerError.message}`);
                throw handlerError;
            }
            
            if (!options?.AutoAck) {
                await this.acknowledgeMessage(eventMessage.EventId);
            }
            
        } catch (error) {
            Logger.instance().log(`Error processing message on ${this.queueName}: ${error.message}`);
            
            if (!options?.AutoAck) {
                const eventMessage = JSON.parse(msg.content.toString());
                const shouldRequeue = options?.RequeueOnFailure !== false;
                await this.rejectMessage(eventMessage.eventId, shouldRequeue);
            }
        }
    }
    
    private async routeEventToHandler(eventMessage: EventMessage): Promise<void> {
        const eventType = eventMessage.EventType;
        
        switch (eventType) {
            case EventType.USER_DELETE:
                Logger.instance().log(`Processed ${eventType} event ${JSON.stringify(eventMessage)} successfully`);
                break;
                
            default:
                Logger.instance().log(`No handler found for event type: ${eventType}, skipping event ${eventMessage.EventId}`);
                break;
        }
    }

}
