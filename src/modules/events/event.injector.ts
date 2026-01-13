import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { ConfigurationManager } from '../../config/configuration.manager';
import { MessagingProvider } from '../../domain.types/events/provider.types';
import { RabbitMqEventPublisher } from './providers/rabbitmq/rabbitmq.event.publisher';
import { RabbitMqEventConsumer } from './providers/rabbitmq/rabbitmq.event.consumer';
import { RabbitMqMessagingProvider } from './providers/rabbitmq/rabbitmq.messaging.provider';
import { AwsEventPublisher } from './providers/aws.sqs/aws.event.publisher';
import { AwsMessagingProvider } from './providers/aws.sqs/aws.messaging.provider';

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class EventInjector {
    
    static registerInjections(container: DependencyContainer) {
        const provider = ConfigurationManager.MessagingProvider();
        if (provider === MessagingProvider.RABBITMQ) {
            container.registerSingleton('IMessagingProvider', RabbitMqMessagingProvider);
            container.register('IEventPublisher', RabbitMqEventPublisher);
            container.register('IEventConsumer', RabbitMqEventConsumer);
        }
        if (provider === MessagingProvider.AWS_SNS_SQS) {
            container.registerSingleton('IMessagingProvider', AwsMessagingProvider);
            container.register('IEventPublisher', AwsEventPublisher);
            // container.register('IEventConsumer', AwsEventConsumer);
        }
    }

}

