import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

import { GcpStorageService } from "./storage.service";
import { GcpPatientStore } from "./patient.store";
import { GcpDoctorStore } from './doctor.store';

// import { GcpClinicOrganizationStore } from "./clinic.organization.store";
// import { GcpDiagnosticLabUserStore } from "./diagnostic.lab.user.store";
import { GcpBloodPressureStore } from "./blood.pressure.store";
import { GcpBodyWeightStore } from "./body.weight.store";
import { GcpBloodGlucoseStore } from "./blood.glucose.store";
// import { GcpBiometricsHeightStore } from "./biometrics.height.store";
import { GcpPulseStore } from './pulse.store';
import { GcpTemperatureStore } from './body.temperature.store';

////////////////////////////////////////////////////////////////////////////////

export class GcpFhirInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', GcpStorageService);
        container.register('IPatientStore', GcpPatientStore);
        container.register('IDoctorStore', GcpDoctorStore);

        // container.register('IClinicOrganizationStore', GcpClinicOrganizationStore);
        // container.register('IDiagnosticLabUserStore', GcpDiagnosticLabUserStore);
        container.register('IBloodPressureStore', GcpBloodPressureStore);
        container.register('IBodyWeightStore', GcpBodyWeightStore);
        container.register('IBloodGlucoseStore', GcpBloodGlucoseStore);
        // container.register('IBiometricsHeightStore', GcpBiometricsHeightStore);
        container.register('IPulseStore',GcpPulseStore);
        container.register('ITemperatureStore',GcpTemperatureStore);

    }

}
