export enum EventType {
    USER_DELETE = 'user.delete'
}

export interface UserDeleteEvent{
    PatientUserId: string;
    TenantId?: string;
    TenantName?: string;
}

export interface PublishOptions {
    Persistent?: boolean;
    Timestamp?: number;
    Type?: EventType;
    MessageId?: string;
    Headers?: Record<string, any>;
    Priority?: number;
    Expiration?: string;
    WaitForConfirmation?: boolean;
}

export interface EventMessage {
    EventId?: string;
    EventType?: EventType;
    Timestamp?: string;
    Payload?: any;
    Metadata?: Record<string, any>;
}

export interface ConsumerOptions {
    AutoAck?: boolean;
    Priority?: number;
    RequeueOnFailure?: boolean;
    PrefetchCount?: number;
}
