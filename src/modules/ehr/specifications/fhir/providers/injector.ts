import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { GcpStorageService } from './gcp/storage.service';
import { PatientStoreGCP } from './gcp/patient.store';

////////////////////////////////////////////////////////////////////////////////

export class FhirInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', GcpStorageService);
        container.register('IPatientStore', PatientStoreGCP);

    }

}
