import { SQS } from 'aws-sdk';
import { injectable } from 'tsyringe';
import { IMessagingProvider } from '../../interfaces/messaging.povider.interface';
import { IEventPublisher } from '../../interfaces/event.publisher.interface';
import { MessagingConfig } from '../../../../domain.types/events/provider.types';
import { ConfigurationManager } from '../../../../config/configuration.manager';
import { Logger } from '../../../../common/logger';
import { AwsEventPublisher } from './aws.event.publisher';

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class AwsMessagingProvider implements IMessagingProvider {
    
    private sqs: SQS | null = null;

    private config: MessagingConfig;

    private isInitialized: boolean = false;
    
    private queueUrls: Map<string, string> = new Map();

    private mainQueueUrl: string | null = null;

    constructor() {
        this.config = ConfigurationManager.MessagingConfig();
    }

    async initialize(): Promise<void> {
        try {
            if (this.isInitialized) {
                return;
            }

            this.sqs = new SQS({
                region          : process.env.AWS_REGION,
                accessKeyId     : process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
            });

            await this.setupQueues();

            this.isInitialized = true;
            Logger.instance().log('AWS SQS messaging provider initialized successfully');

        } catch (error) {
            Logger.instance().log(`Failed to initialize AWS SQS messaging provider: ${error.message}`);
            throw error;
        }
    }

    private async setupQueues(): Promise<void> {
        try {
            const queueNames = this.getEventQueues();
            
            for (const queueName of queueNames) {
                await this.createOrVerifyQueue(queueName);
            }

            this.mainQueueUrl = this.queueUrls.values().next().value || null;

            Logger.instance().log(`Setup ${queueNames.length} SQS queues successfully`);

        } catch (error) {
            Logger.instance().log(`Error setting up SQS queues: ${error.message}`);
            throw error;
        }
    }

    private async createOrVerifyQueue(queueName: string): Promise<void> {
        if (!this.sqs) {
            throw new Error('SQS client not initialized');
        }

        try {
            let queueUrl: string | null = null;
            
            try {
                const getUrlResult = await this.sqs.getQueueUrl({
                    QueueName : queueName
                }).promise();
                queueUrl = getUrlResult.QueueUrl;
                Logger.instance().log(`Found existing SQS queue: ${queueName}`);
            } catch (error) {
                queueUrl = await this.createQueue(queueName);
            }

            this.queueUrls.set(queueName, queueUrl);

            await this.verifyQueueAccess(queueUrl);

        } catch (error) {
            Logger.instance().log(`Error setting up queue ${queueName}: ${error.message}`);
            throw error;
        }
    }

    private async createQueue(queueName: string): Promise<string> {
        if (!this.sqs) {
            throw new Error('SQS client not initialized');
        }

        try {
            const queueAttributes: { [key: string]: string } = {
                MessageRetentionPeriod : this.config.Events.MessageRetentionPeriod ?
                    this.config.Events.MessageRetentionPeriod.toString() : '1209600', // 14 days
                
                VisibilityTimeout : '30',
                
                ReceiveMessageWaitTimeSeconds : '20'
            };

            if (this.config.Events.DeadLetterQueue.Enabled) {
                const dlqName = `${queueName}-dlq`;
                const dlqUrl = await this.createDeadLetterQueue(dlqName);
                
                const dlqArn = await this.getQueueArn(dlqUrl);
                
                queueAttributes.RedrivePolicy = JSON.stringify({
                    deadLetterTargetArn : dlqArn,
                    maxReceiveCount     : this.config.Events.DeadLetterQueue.MaxReceiveCount || 3
                });
            }

            const result = await this.sqs.createQueue({
                QueueName  : queueName,
                Attributes : queueAttributes
            }).promise();

            Logger.instance().log(`Created SQS queue: ${queueName}`);
            return result.QueueUrl!;

        } catch (error) {
            Logger.instance().log(`Error creating queue ${queueName}: ${error.message}`);
            throw error;
        }
    }

    private async createDeadLetterQueue(dlqName: string): Promise<string> {
        if (!this.sqs) {
            throw new Error('SQS client not initialized');
        }

        try {
            const result = await this.sqs.createQueue({
                QueueName  : dlqName,
                Attributes : {
                    MessageRetentionPeriod : '1209600', // 14 days
                    VisibilityTimeout      : '30'
                }
            }).promise();

            Logger.instance().log(`Created Dead Letter Queue: ${dlqName}`);
            return result.QueueUrl!;

        } catch (error) {
            if (error.code === 'QueueAlreadyExists') {
                const getUrlResult = await this.sqs.getQueueUrl({
                    QueueName : dlqName
                }).promise();
                return getUrlResult.QueueUrl!;
            }
            throw error;
        }
    }

    private async getQueueArn(queueUrl: string): Promise<string> {
        if (!this.sqs) {
            throw new Error('SQS client not initialized');
        }

        const result = await this.sqs.getQueueAttributes({
            QueueUrl       : queueUrl,
            AttributeNames : ['QueueArn']
        }).promise();

        return result.Attributes!.QueueArn;
    }

    private async verifyQueueAccess(queueUrl: string): Promise<void> {
        if (!this.sqs) {
            throw new Error('SQS client not initialized');
        }

        try {
            await this.sqs.getQueueAttributes({
                QueueUrl       : queueUrl,
                AttributeNames : ['QueueArn']
            }).promise();
        } catch (error) {
            throw new Error(`Failed to access queue ${queueUrl}: ${error.message}`);
        }
    }

    private getEventQueues(): string[] {
        let env = process.env.NODE_ENV;
        env = env === "development" || env === "dev" || env === "Development" || env === "Dev" ? "dev" : env;
        env = env === "production" || env === "prod" || env === "Production" || env === "Prod" ? "prod" : env;

        if (!env) {
            throw new Error('NODE_ENV is not set');
        }
        
        return [
            `bot-wrapper-${env}-queue`,
            `careplan-${env}-queue`,
            `followup-${env}-queue`
        ];
    }

    private ensureInitialized(): void {
        if (!this.isInitialized || !this.sqs || this.queueUrls.size === 0) {
            throw new Error('AWS SQS messaging provider is not initialized. Call initialize() first.');
        }
    }
    
    getPublisher(): IEventPublisher {
        this.ensureInitialized();
        return new AwsEventPublisher(this.sqs!, this.queueUrls, this.config);
    }

    getQueueUrls(): Map<string, string> {
        this.ensureInitialized();
        return new Map(this.queueUrls);
    }

    async close(): Promise<void> {
        try {
            if (this.isInitialized) {
                this.sqs = null;
                this.queueUrls.clear();
                this.mainQueueUrl = null;
                this.isInitialized = false;
                
                Logger.instance().log('AWS SQS messaging provider closed successfully');
            }
        } catch (error) {
            Logger.instance().log(`Error closing AWS SQS messaging provider: ${error.message}`);
            throw error;
        }
    }

}
