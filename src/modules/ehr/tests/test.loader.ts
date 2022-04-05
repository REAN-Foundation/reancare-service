import 'reflect-metadata';
import { container } from 'tsyringe';
import { StorageService } from '../services/storage.service';
import { PatientStore } from '../services/patient.store';
import { DoctorStore } from '../services/doctor.store';
import { Logger } from '../../../common/logger';
import { ConfigurationManager } from '../../../config/configuration.manager';
import { LabVisitStore } from '../services/lab.visit.store';
import { DiagnosticConditionStore } from '../services/diagnostic.condition.store';
// import { ClinicOrganizationStore } from '../services/clinic.organization.store';
// import { DiagnosticLabUserStore } from '../services/diagnostic.lab.user.store';
import { PharmacistStore } from '../services/pharmacist.store';
import { PharmacyStore } from '../services/pharmacy.organization.store';
import { BloodPressureStore } from '../services/blood.pressure.store';
import { BodyWeightStore } from '../services/body.weight.store';
import { BiometricsHeightStore } from '../services/biometrics.height.store';
import { EhrInjector } from '../ehr.injector';
import { CarePlanStore } from '../services/careplan.service';
import { HospitalOrganizationStore } from '../services/hospital.organization.store';
import { PulseStore } from '../services/pulse.store';
import { TemperatureStore } from '../services/body.temperature.store';
import { BloodGlucoseStore } from '../services/blood.glucose.store';

//////////////////////////////////////////////////////////////////////////////////////////////////

//Initializations

ConfigurationManager.loadConfigurations();
EhrInjector.registerInjections(container);

//////////////////////////////////////////////////////////////////////////////////////////////////

export class TestLoader {

    //#region static member variables

    private static _storageService: StorageService = container.resolve(StorageService);

    private static _patientStore: PatientStore = container.resolve(PatientStore);

    private static _doctorStore: DoctorStore = container.resolve(DoctorStore);

    private static _labVisitStore: LabVisitStore = container.resolve(LabVisitStore);
    
    private static _diagnosticConditionStore: DiagnosticConditionStore = container.resolve(DiagnosticConditionStore);
    
    private static _carePlanStore: CarePlanStore = container.resolve(CarePlanStore);

    private static _hospitalOrganizationStore: HospitalOrganizationStore = container.resolve(HospitalOrganizationStore);

    // private static _clinicOrganizationStore: ClinicOrganizationStore = container.resolve(ClinicOrganizationStore);
    // private static _diagnosticlabuserStore: DiagnosticLabUserStore = container.resolve(DiagnosticLabUserStore);
    private static _pharmacistStore: PharmacistStore = container.resolve(PharmacistStore);

    private static _pharmacyStore: PharmacyStore = container.resolve(PharmacyStore);

    private static _biometricsHeightStore: BiometricsHeightStore = container.resolve(BiometricsHeightStore);

    private static _bloodPressureStore: BloodPressureStore = container.resolve(BloodPressureStore);

    private static _bodyWeightStore: BodyWeightStore = container.resolve(BodyWeightStore);

    private static _bloodGlucoseStore: BloodGlucoseStore = container.resolve(BloodGlucoseStore);

    private static _pulseStore: PulseStore = container.resolve(PulseStore)

    private static _temperatureStore: TemperatureStore = container.resolve(TemperatureStore)

    //#endregion

    //#region static properties

    public static get StorageService() {
        return TestLoader._storageService;
    }
    
    public static get PatientStore() {
        return TestLoader._patientStore;
    }

    public static get DoctorStore() {
        return TestLoader._doctorStore;
    }

    public static get DiagnosticConditionStore() {
        return TestLoader._diagnosticConditionStore;
    }

    public static get CarePlanStore() {
        return TestLoader._carePlanStore;
    }

    public static get HospitalOrganizationStore() {
        return TestLoader._hospitalOrganizationStore;
    }

    // public static get DiagnosticLabUserStore() {
    //     return TestLoader._diagnosticlabuserStore;
    // }

    public static get PharmacistStore() {
        return TestLoader._pharmacistStore;
    }

    public static get PharmacyStore() {
        return TestLoader._pharmacyStore;
    }

    public static get BloodPressureStore() {
        return TestLoader._bloodPressureStore;
    }

    public static get BodyWeightStore() {
        return TestLoader._bodyWeightStore;
    }
  
    public static get BloodGlucoseStore() {
        return TestLoader._bloodGlucoseStore;
    }

    public static get BiometricsHeightStore() {
        return TestLoader._biometricsHeightStore;
    }

    public static get LabVisitStore() {
        return TestLoader._labVisitStore;
    }

    public static get PulseStore() {
        return TestLoader._pulseStore;
    }

    public static get TemperatureStore() {
        return TestLoader._temperatureStore;
    }
    //#endregion

    public static init = async () => {
        try {

            TestLoader._storageService = container.resolve(StorageService);

            TestLoader._patientStore = container.resolve(PatientStore);
            TestLoader._doctorStore = container.resolve(DoctorStore);
            TestLoader._carePlanStore = container.resolve(CarePlanStore);
            TestLoader._hospitalOrganizationStore = container.resolve(HospitalOrganizationStore);
            TestLoader._labVisitStore = container.resolve(LabVisitStore);
            TestLoader._diagnosticConditionStore = container.resolve(DiagnosticConditionStore);
            TestLoader._pharmacistStore = container.resolve(PharmacistStore);
            TestLoader._pharmacyStore = container.resolve(PharmacyStore);
            TestLoader._biometricsHeightStore = container.resolve(BiometricsHeightStore);
            TestLoader._bloodPressureStore = container.resolve(BloodPressureStore);
            TestLoader._bloodGlucoseStore = container.resolve(BloodGlucoseStore);
            TestLoader._bodyWeightStore = container.resolve(BodyWeightStore);
            TestLoader._pulseStore = container.resolve(PulseStore);
            TestLoader._temperatureStore = container.resolve(TemperatureStore);
            
            //Finally intitialize Fhir storage provider
            const initialized = await TestLoader._storageService.init();
            if (initialized) {
                Logger.instance().log('FHIR storage service initialized.');
            }

        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
