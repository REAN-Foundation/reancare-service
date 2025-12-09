import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { CommunicationInjector } from './communication/communication.injector';
import { EhrInjector } from './ehr/ehr.injector';
import { FileStorageInjector } from './storage/file.storage.injector';
import { EventInjector } from './events/event.injector';
import { UserTaskHandlerInjector } from '../services/users/user/user.task.handlers/user.task.handler.injector';

////////////////////////////////////////////////////////////////////////////////

export class ModuleInjector {

    static registerInjections(container: DependencyContainer) {

        EhrInjector.registerInjections(container);
        CommunicationInjector.registerInjections(container);
        FileStorageInjector.registerInjections(container);
        EventInjector.registerInjections(container);
        UserTaskHandlerInjector.registerInjections(container);
    }

}
