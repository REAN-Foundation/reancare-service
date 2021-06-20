import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { GcpFhirStoreService } from './standards/fhir/providers/gcp/fhir.service.gcp';
import { PatientStoreGCP } from './standards/fhir/providers/gcp/patient.store.gcp';

////////////////////////////////////////////////////////////////////////////////

export class EhrInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', GcpFhirStoreService);
        container.register('IPatientStore', PatientStoreGCP);

    }
}
