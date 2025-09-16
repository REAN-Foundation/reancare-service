export enum MessagingProvider {
    AWS_SNS_SQS = 'AWS-SNS-SQS',
    AZURE_SERVICE_BUS = 'Azure-ServiceBus',
    GCP_PUB_SUB = 'GCP-PubSub',
    RABBITMQ = 'RabbitMQ'
}

export interface MessagingConfig {
    Provider: MessagingProvider;
    Events: {
        Enabled: boolean;
        RetryPolicy: {
            MaxRetries: number;
            BackoffMultiplier: number;
            MaxBackoffSeconds: number;
        };
        DeadLetterQueue: {
            Enabled: boolean;
            MaxReceiveCount: number;
        };
        MessageRetentionPeriod?: number;
        VisibilityTimeout?: number;
    };
}
