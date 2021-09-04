import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { TwilioMessagingService } from './communication/providers/twilio.messaging.service';
import { EhrInjector } from './ehr/ehr.injector';

////////////////////////////////////////////////////////////////////////////////

export class ModuleInjector {

    static registerInjections(container: DependencyContainer) {
        
        EhrInjector.registerInjections(container);
        
        container.register('IMessagingService', TwilioMessagingService);
    }

}
