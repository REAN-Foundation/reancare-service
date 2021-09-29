import 'reflect-metadata';
import { ConfigurationManager } from '../../configs/configuration.manager';
import { DependencyContainer } from 'tsyringe';
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
