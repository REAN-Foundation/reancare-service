import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { MockStorageService } from "./storage.service";
import { MockPatientStore } from "./patient.store";

// import { MockClinicOrganizationStore } from "./clinic.organization.store";
// import { MockDiagnosticLabUserStore } from "./diagnostic.lab.user.store";
// import { MockDoctorStore } from './doctor.store';
// import { MockPharmacistStore } from './pharmacist.store';
import { MockBloodPressureStore } from "./blood.pressure.store";
import { MockBiometricsWeightStore } from "./biometrics.weight.store";
import { MockBloodSugarStore } from "./blood.sugar.store";
// import { MockBiometricsHeightStore } from "./biometrics.height.store";
import { MockPulse } from "./pulse.store";
import { MockTemperatureStore } from "./temperature.store";

////////////////////////////////////////////////////////////////////////////////

export class MockEhrInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', MockStorageService);
        container.register('IPatientStore', MockPatientStore);

        // container.register('IClinicOrganizationStore', MockClinicOrganizationStore);
        // container.register('IDiagnosticLabUserStore', MockDiagnosticLabUserStore);
        // container.register('IDoctorStore', MockDoctorStore);
        // container.register('IPharmacistStore', MockPharmacistStore);
        container.register('IBloodPressureStore', MockBloodPressureStore);
        container.register('IBiometricsWeightStore', MockBiometricsWeightStore);
        container.register('IBloodSugarStore', MockBloodSugarStore);
        // container.register('IBiometricsHeightStore', MockBiometricsHeightStore);
        container.register('IPulseStore',MockPulse);
        container.register('ITemperature',MockTemperatureStore);

    }

}
