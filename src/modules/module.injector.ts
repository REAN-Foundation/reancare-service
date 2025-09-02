import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { CommunicationInjector } from './communication/communication.injector';
import { EhrInjector } from './ehr/ehr.injector';
import { FileStorageInjector } from './storage/file.storage.injector';
import { FunctionsInjector } from './cloud.services/functions.injector';

////////////////////////////////////////////////////////////////////////////////

export class ModuleInjector {

    static registerInjections(container: DependencyContainer) {

        EhrInjector.registerInjections(container);
        CommunicationInjector.registerInjections(container);
        FileStorageInjector.registerInjections(container);
        FunctionsInjector.registerInjections(container);

    }

}
