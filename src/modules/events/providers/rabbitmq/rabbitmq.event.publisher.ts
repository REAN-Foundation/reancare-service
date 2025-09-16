import { Channel } from 'amqplib';
import { IEventPublisher } from '../../interfaces/event.publisher.interface';
import { EventMessage, EventType, PublishOptions } from '../../../../domain.types/events/event.types';
import { MessagingConfig } from '../../../../domain.types/events/provider.types';
import { Logger } from '../../../../common/logger';
import { v4 as uuidv4 } from 'uuid';

export class RabbitMqEventPublisher implements IEventPublisher {
    
    constructor(
        private channel: Channel,
        private config: MessagingConfig
    ) {}
    
    async publishEvent<T>(eventType: EventType, event: T, options?: PublishOptions): Promise<void> {
        try {
            
            if (!this.config.Events.Enabled) {
                throw new Error('Events are disabled in configuration');
            }
            
            const exchangeName = process.env.TOPIC_NAME;
            
            await this.channel.assertExchange(exchangeName, 'fanout', {
                durable    : true,
                autoDelete : false
            });
            
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
            
            const message = Buffer.from(JSON.stringify(messagePayload));
            
            const publishOptions = {
                persistent : true,
                messageId  : messagePayload.EventId,
                timestamp  : Date.now(),
                type       : eventType,
                headers    : {
                    eventType : eventType,
                    source    : messagePayload.Metadata.source,
                    ...options?.Headers
                },
                priority   : options?.Priority || 0,
                expiration : options?.Expiration ?
                    options.Expiration.toString() :
                    (this.config.Events.MessageRetentionPeriod ?
                        (this.config.Events.MessageRetentionPeriod * 1000).toString() : undefined)
            };
            
            const published = this.channel.publish(exchangeName, '', message, publishOptions);
            
            if (published) {
                Logger.instance().log(
                    `Published ${eventType} event ${messagePayload.EventId} to exchange ${exchangeName}`
                );
            }
            
        } catch (error) {
            Logger.instance().log(`Error publishing ${eventType} event: ${error.message}`);
            throw error;
        }
    }

}

