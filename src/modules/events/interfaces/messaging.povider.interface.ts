import { IEventPublisher } from './event.publisher.interface';

export interface IMessagingProvider {
    
    getPublisher(): IEventPublisher;
   
    initialize?(): Promise<void>;
    
    close?(): Promise<void>;

}
