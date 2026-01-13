import { SQS } from 'aws-sdk';
import { IEventPublisher } from '../../interfaces/event.publisher.interface';
import { EventMessage, EventType, PublishOptions } from '../../../../domain.types/events/event.types';
import { MessagingConfig } from '../../../../domain.types/events/provider.types';
import { Logger } from '../../../../common/logger';
import { v4 as uuidv4 } from 'uuid';

///////////////////////////////////////////////////////////////////////////////

export class AwsEventPublisher implements IEventPublisher {
    
    constructor(
        private sqs: SQS,
        private queueUrls: Map<string, string>,
        private config: MessagingConfig
    ) {}
    
    async publishEvent<T>(
        eventType: EventType,
        event: T,
        options?: PublishOptions
    ): Promise<void> {
        try {
            if (!this.config.Events.Enabled) {
                throw new Error('Events are disabled in configuration');
            }
            
            const messagePayload: EventMessage = {
                EventId   : options?.MessageId || uuidv4(),
                EventType : eventType,
                Timestamp : new Date().toISOString(),
                Payload   : event,
                Metadata  : {
                    source  : 'reancare-service',
                    version : '1.0',
                    ...options?.Headers
                }
            };
            
            const messageAttributes: { [key: string]: SQS.MessageAttributeValue } = {
                eventType : {
                    DataType    : 'String',
                    StringValue : eventType
                },
                source : {
                    DataType    : 'String',
                    StringValue : messagePayload.Metadata.source
                },
                eventId : {
                    DataType    : 'String',
                    StringValue : messagePayload.EventId
                }
            };
            
            if (options?.Headers) {
                for (const [key, value] of Object.entries(options.Headers)) {
                    messageAttributes[key] = {
                        DataType    : 'String',
                        StringValue : String(value)
                    };
                }
            }
            
            const publishPromises: Promise<SQS.SendMessageResult>[] = [];
            const targetQueues = Array.from(this.queueUrls.entries());
            
            Logger.instance().log(
                `Publishing ${eventType} event ${messagePayload.EventId} to ${targetQueues.length} queues (fanout pattern)`
            );
            
            for (const [queueName, queueUrl] of targetQueues) {
                const sendMessageParams: SQS.SendMessageRequest = {
                    QueueUrl          : queueUrl,
                    MessageBody       : JSON.stringify(messagePayload),
                    MessageAttributes : messageAttributes,
                    ...(this.isFifoQueue(queueUrl) && {
                        MessageGroupId         : eventType,
                        MessageDeduplicationId : `${messagePayload.EventId}-${queueName}`
                    })
                };
                
                if (options?.Expiration) {
                    const delaySeconds = parseInt(options.Expiration);
                    if (!isNaN(delaySeconds) && delaySeconds <= 900) {
                        sendMessageParams.DelaySeconds = delaySeconds;
                    }
                }
                
                const publishPromise = this.sqs.sendMessage(sendMessageParams).promise()
                    .then(result => {
                        Logger.instance().log(
                            `Published to queue '${queueName}': MessageId ${result.MessageId}`
                        );
                        return result;
                    })
                    .catch(error => {
                        Logger.instance().log(
                            `Failed to publish to queue '${queueName}': ${error.message}`
                        );
                        throw error;
                    });
                
                publishPromises.push(publishPromise);
            }
            
            const results = await Promise.all(publishPromises);
            
            Logger.instance().log(
                `Successfully published ${eventType} event ${messagePayload.EventId} to ${results.length}/${targetQueues.length} queues`
            );
            
            if (options?.WaitForConfirmation) {
                Logger.instance().log(`Confirmed delivery of event ${messagePayload.EventId} to all queues`);
            }
            
        } catch (error) {
            Logger.instance().log(`Error publishing ${eventType} event to SQS queues: ${error.message}`);
            throw error;
        }
    }
    
    private isFifoQueue(queueUrl: string): boolean {
        return queueUrl.endsWith('.fifo');
    }
    
    getQueueCount(): number {
        return this.queueUrls.size;
    }
    
    getTargetQueues(): string[] {
        return Array.from(this.queueUrls.keys());
    }

}
