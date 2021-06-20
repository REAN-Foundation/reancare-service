import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { GcpStorageService } from './standards/fhir/providers/gcp/storage.service';
import { PatientStoreGCP } from './standards/fhir/providers/gcp/patient.store';

////////////////////////////////////////////////////////////////////////////////

export class EhrInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', GcpStorageService);
        container.register('IPatientStore', PatientStoreGCP);

    }
}
