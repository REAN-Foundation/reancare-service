export interface IEventConsumer {
    
    startListening(): Promise<void>;
    
    stopListening(): Promise<void>;
    
    acknowledgeMessage(messageId: string): Promise<void>;
    
    rejectMessage(messageId: string, requeue: boolean): Promise<void>;
    
    close(): Promise<void>;
}
