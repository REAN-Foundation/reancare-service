import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { ConfigurationManager } from '../../config/configuration.manager';
import { TwilioMessagingService } from './providers/twilio.messaging.service';

////////////////////////////////////////////////////////////////////////////////

export class CommunicationInjector {

    static registerInjections(container: DependencyContainer) {

        const smsProvider = ConfigurationManager.SMSServiceProvider();
        if (smsProvider === 'Twilio') {
            container.register('IMessagingService', TwilioMessagingService);
        }
    }
    
}
