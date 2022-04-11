import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

import { GcpStorageService } from "./storage.service";
import { GcpPatientStore } from "./patient.store";
import { GcpDoctorStore } from './doctor.store';
import { GcpDiagnosticLabUserStore } from './diagnostic.lab.user.store';
import { GcpLabOrganizationStore } from './lab.organization.store';

// import { GcpClinicOrganizationStore } from "./clinic.organization.store";
// import { GcpDiagnosticLabUserStore } from "./diagnostic.lab.user.store";
// import { GcpPharmacistStore } from './pharmacist.store';
// import { GcpBloodPressureStore } from "./blood.pressure.store";
// import { GcpBiometricsWeightStore } from "./biometrics.weight.store";
// import { GcpBloodSugarStore } from "./blood.sugar.store";
// import { GcpBiometricsHeightStore } from "./biometrics.height.store";

////////////////////////////////////////////////////////////////////////////////

export class GcpFhirInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', GcpStorageService);
        container.register('IPatientStore', GcpPatientStore);
        container.register('IDoctorStore', GcpDoctorStore);

        container.register('ILabOrganizationStore', GcpLabOrganizationStore);
        container.register('IDiagnosticLabUserStore', GcpDiagnosticLabUserStore);
        // container.register('IPharmacistStore', GcpPharmacistStore);
        // container.register('IBloodPressureStore', GcpBloodPressureStore);
        // container.register('IBiometricsWeightStore', GcpBiometricsWeightStore);
        // container.register('IBloodSugarStore', GcpBloodSugarStore);
        // container.register('IBiometricsHeightStore', GcpBiometricsHeightStore);

    }

}
