import 'reflect-metadata';
import { container } from 'tsyringe';
import { StorageService } from '../services/storage.service';
import { PatientStore } from '../services/patient.store';
import { DoctorStore } from '../services/doctor.store';
import { Logger } from '../../../common/logger';
import { ConfigurationManager } from '../../../config/configuration.manager';

// import { ClinicOrganizationStore } from '../services/clinic.organization.store';
// import { DiagnosticLabUserStore } from '../services/diagnostic.lab.user.store';
import { BloodPressureStore } from '../services/blood.pressure.store';
import { BiometricsWeightStore } from '../services/biometrics.weight.store';
// import { BloodSugarStore } from '../services/blood.sugar.store';
// import { BiometricsHeightStore } from '../services/biometrics.height.store';

import { EhrInjector } from '../ehr.injector';
import { PulseStore } from '../services/pulse.store';
import { TemperatureStore } from '../services/temperature.store';
import { BloodSugarStore } from '../services/blood.sugar.store';

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

    // private static _clinicOrganizationStore: ClinicOrganizationStore = container.resolve(ClinicOrganizationStore);
    // private static _diagnosticlabuserStore: DiagnosticLabUserStore = container.resolve(DiagnosticLabUserStore);

    private static _bloodPressureStore: BloodPressureStore = container.resolve(BloodPressureStore);

    private static _biometricsWeightStore: BiometricsWeightStore = container.resolve(BiometricsWeightStore);

    private static _bloodSugarStore: BloodSugarStore = container.resolve(BloodSugarStore);

    // private static _biometricsHeightStore: BiometricsHeightStore = container.resolve(BiometricsHeightStore);
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

    // public static get DiagnosticLabUserStore() {
    //     return TestLoader._diagnosticlabuserStore;
    // }

    public static get BloodPressureStore() {
        return TestLoader._bloodPressureStore;
    }

    public static get BiometricsWeightStore() {
        return TestLoader._biometricsWeightStore;
    }
  
    public static get BloodSugarStore() {
        return TestLoader._bloodSugarStore;
    }

    // public static get BiometricsHeightStore() {
    //     return TestLoader._biometricsHeightStore;
    // }

    // public static get ClinicOrganizationStore() {
    //     return TestLoader._clinicOrganizationStore;
    // }

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

            // TestLoader._clinicOrganizationStore = container.resolve(ClinicOrganizationStore);
            // TestLoader._diagnosticlabuserStore = container.resolve(DiagnosticLabUserStore);
            TestLoader._bloodPressureStore = container.resolve(BloodPressureStore);
            TestLoader._bloodSugarStore = container.resolve(BloodSugarStore);
            // TestLoader._biometricsHeightStore = container.resolve(BiometricsHeightStore);
            TestLoader._biometricsWeightStore = container.resolve(BiometricsWeightStore);
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
