import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { GcpStorageService } from "./storage.service";
import { GcpPatientStore } from "./patient.store";
import { GcpDoctorStore } from './doctor.store';
import { GcpDiagnosticLabUserStore } from './diagnostic.lab.user.store';
import { GcpLabOrganizationStore } from './lab.organization.store';
import { GcpLabVisitStore } from './lab.visit.store';
import { GcpCarePlanStore } from './careplan.store';
import { GcpHospitalOrganizationStore } from './hospital.organization.store';
import { GcpDiagnosticConditionStore } from './diagnostic.condition.store';
import { GcpDoctorVisitStore } from './doctor.visit.store';
import { GcpImagingStudyStore } from './imaging.study.store';
import { GcpFamilyHistoryStore } from './family.history.store';
import { GcpClinicOrganizationStore } from "./clinic.organization.store";
import { GcpMedicationConsumptionStore } from './medication.consumption.store';
import { GcpBloodOxygenSaturationStore } from './blood.oxygen.saturation.store';
import { GcpPharmacistStore } from './pharmacist.store';
import { GcpPharmacyOrganizationStore } from './pharmacy.organization.store';
import { GcpBiometricsHeightStore } from "./biometrics.height.store";
import { GcpBloodPressureStore } from "./blood.pressure.store";
import { GcpBodyWeightStore } from "./body.weight.store";
import { GcpBloodGlucoseStore } from "./blood.glucose.store";
import { GcpPulseStore } from './pulse.store';
import { GcpTemperatureStore } from './body.temperature.store';

////////////////////////////////////////////////////////////////////////////////

export class GcpFhirInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IStorageService', GcpStorageService);
        container.register('IPatientStore', GcpPatientStore);
        container.register('IDoctorStore', GcpDoctorStore);
        container.register('IBloodOxygenSaturationStore',GcpBloodOxygenSaturationStore);
        container.register('ILabVisitStore', GcpLabVisitStore);
        container.register('ICarePlanStore', GcpCarePlanStore);
        container.register('IHospitalOrganizationStore', GcpHospitalOrganizationStore);
        container.register('IDiagnosticConditionStore', GcpDiagnosticConditionStore);
        container.register('IDoctorVisitStore', GcpDoctorVisitStore);
        container.register('IImagingStudyStore', GcpImagingStudyStore);
        container.register('IFamilyHistoryStore', GcpFamilyHistoryStore);
        container.register('ILabOrganizationStore', GcpLabOrganizationStore);
        container.register('IDiagnosticLabUserStore', GcpDiagnosticLabUserStore);
        container.register('IClinicOrganizationStore', GcpClinicOrganizationStore);
        container.register('IMedicationConsumptionStore',GcpMedicationConsumptionStore);
        container.register('IPharmacistStore', GcpPharmacistStore);
        container.register('IPharmacyOrganizationStore', GcpPharmacyOrganizationStore);
        container.register('IBiometricsHeightStore', GcpBiometricsHeightStore);
        container.register('IBloodPressureStore', GcpBloodPressureStore);
        container.register('IBodyWeightStore', GcpBodyWeightStore);
        container.register('IBloodGlucoseStore', GcpBloodGlucoseStore);
        container.register('IPulseStore',GcpPulseStore);
        container.register('ITemperatureStore',GcpTemperatureStore);

    }

}
