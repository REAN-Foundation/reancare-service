import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

import { GcpStorageService } from "./storage.service";
import { GcpPatientStore } from "./patient.store";

// import { GcpClinicOrganizationStore } from "./providers/gcp/clinic.organization.store";
// import { GcpDiagnosticLabUserStore } from "./providers/gcp/diagnostic.lab.user.store";
// import { GcpDoctorStore } from './providers/gcp/doctor.store';
// import { GcpPharmacistStore } from './providers/gcp/pharmacist.store';
// import { GcpBloodPressureStore } from "./providers/gcp/blood.pressure.store";
// import { GcpBiometricsWeightStore } from "./providers/gcp/biometrics.weight.store";
// import { GcpBloodSugarStore } from "./providers/gcp/blood.sugar.store";
// import { GcpBiometricsHeightStore } from "./providers/gcp/biometrics.height.store";

////////////////////////////////////////////////////////////////////////////////

export class GcpFhirInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', GcpStorageService);
        container.register('IPatientStore', GcpPatientStore);

        // container.register('IClinicOrganizationStore', GcpClinicOrganizationStore);
        // container.register('IDiagnosticLabUserStore', GcpDiagnosticLabUserStore);
        // container.register('IDoctorStore', GcpDoctorStore);
        // container.register('IPharmacistStore', GcpPharmacistStore);
        // container.register('IBloodPressureStore', GcpBloodPressureStore);
        // container.register('IBiometricsWeightStore', GcpBiometricsWeightStore);
        // container.register('IBloodSugarStore', GcpBloodSugarStore);
        // container.register('IBiometricsHeightStore', GcpBiometricsHeightStore);

    }

}
