import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

import { GcpStorageService } from "./storage.service";
import { GcpPatientStore } from "./patient.store";
import { GcpDoctorStore } from './doctor.store';

import { GcpClinicOrganizationStore } from "./clinic.organization.store";
// import { GcpDiagnosticConditionStore } from "./diagnostic.condition.store";
// import { GcpPharmacistStore } from './pharmacist.store';
// import { GcpBloodPressureStore } from "./blood.pressure.store";
// import { GcpBiometricsWeightStore } from "./biometrics.weight.store";
// import { GcpBloodSugarStore } from "./blood.sugar.store";
// import { GcpBiometricsHeightStore } from "./biometrics.height.store";
// import { GcpPulseStore } from './pulse.store';
// import { GcpTemperatureStore } from './temperature.store';
// import { GcpBloodOxygenSaturationStore } from './blood.oxygen.saturation.store';
import { GcpMedicationConsumptionStore } from './medication.consumption.store';
// import { GcpDiagnosticConditionStore } from './diagnostic.condition.store';

////////////////////////////////////////////////////////////////////////////////

export class GcpFhirInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', GcpStorageService);
        container.register('IPatientStore', GcpPatientStore);
        container.register('IDoctorStore', GcpDoctorStore);

        container.register('IClinicOrganizationStore', GcpClinicOrganizationStore);
        // container.register('IDiagnosticConditionStore', GcpDiagnosticConditionStore);
        // container.register('IPharmacistStore', GcpPharmacistStore);
        // container.register('IBloodPressureStore', GcpBloodPressureStore);
        // container.register('IBiometricsWeightStore', GcpBiometricsWeightStore);
        // container.register('IBloodSugarStore', GcpBloodSugarStore);
        // container.register('IBiometricsHeightStore', GcpBiometricsHeightStore);
        // container.register('IPulseStore',GcpPulseStore)
        // container.register('ITemperatureStore',GcpTemperatureStore)
        // container.register('IBloodOxygenSaturationStore',GcpBloodOxygenSaturationStore);
        container.register('IMedicationConsumptionStore',GcpMedicationConsumptionStore);

    }

}
