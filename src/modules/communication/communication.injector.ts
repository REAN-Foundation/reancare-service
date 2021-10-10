import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { ConfigurationManager } from '../../config/configuration.manager';
import { TwilioMessagingService } from './messaging.service/providers/twilio.messaging.service';
import { FirebaseNotificationService } from './notification.service/providers/firebase.notification.service';

////////////////////////////////////////////////////////////////////////////////

export class CommunicationInjector {

    static registerInjections(container: DependencyContainer) {

        const smsProvider = ConfigurationManager.SMSServiceProvider();
        if (smsProvider === 'Twilio') {
            container.register('IMessagingService', TwilioMessagingService);
        }

        const notificationProvider = ConfigurationManager.InAppNotificationServiceProvider();
        if (notificationProvider === 'Firebase') {
            container.register('INotificationService', FirebaseNotificationService);
        }
    }
    
}
