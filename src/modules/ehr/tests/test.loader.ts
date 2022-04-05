import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';
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
// import { BloodPressureStore } from '../services/blood.pressure.store';
// import { BiometricsWeightStore } from '../services/biometrics.weight.store';
// import { BloodSugarStore } from '../services/blood.sugar.store';
import { BiometricsHeightStore } from '../services/biometrics.height.store';
import { EhrInjector } from '../ehr.injector';
import { CarePlanStore } from '../services/careplan.service';
import { HospitalOrganizationStore } from '../services/hospital.organization.store';

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

    // private static _bloodPressureStore: BloodPressureStore = container.resolve(BloodPressureStore);
    // private static _biometricsWeightStore: BiometricsWeightStore = container.resolve(BiometricsWeightStore);
    // private static _bloodSugarStore: BloodSugarStore = container.resolve(BloodSugarStore);
    private static _biometricsHeightStore: BiometricsHeightStore = container.resolve(BiometricsHeightStore);

    private static _container: DependencyContainer = container;

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

    // public static get BloodPressureStore() {
    //     return TestLoader._bloodPressureStore;
    // }

    // public static get BiometricsWeightStore() {
    //     return TestLoader._biometricsWeightStore;
    // }
  
    // public static get BloodSugarStore() {
    //     return TestLoader._bloodSugarStore;
    // }

    public static get BiometricsHeightStore() {
        return TestLoader._biometricsHeightStore;
    }

    public static get LabVisitStore() {
        return TestLoader._labVisitStore;
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
            // TestLoader._bloodPressureStore = container.resolve(BloodPressureStore);
            // TestLoader._bloodSugarStore = container.resolve(BloodSugarStore);
            // TestLoader._biometricsHeightStore = container.resolve(BiometricsHeightStore);
            TestLoader._pharmacistStore = container.resolve(PharmacistStore);
            TestLoader._pharmacyStore = container.resolve(PharmacyStore);
            TestLoader._biometricsHeightStore = container.resolve(BiometricsHeightStore);
            // TestLoader._biometricsWeightStore = container.resolve(BiometricsWeightStore);

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
