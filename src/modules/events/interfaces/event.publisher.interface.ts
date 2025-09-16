import { EventType, PublishOptions } from '../../../domain.types/events/event.types';

export interface IEventPublisher {
    
    publishEvent<T>(eventType: EventType, event: T, options?: PublishOptions): Promise<void>;

}
