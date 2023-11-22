
import { EHRAnalyticsRepo } from "./ehr.analytics.repo";
import {
    EHRDynamicRecordDomainModel,
    EHRStaticRecordDomainModel
} from './ehr.analytics.domain.model';
import * as asyncLib from 'async';
import { Logger } from "../../common/logger";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EHRRecordTypes } from "./ehr.record.types";
import { ConfigurationManager } from "../../config/configuration.manager";
import { EHRMedicationDomainModel } from "./ehr.medication.domain.model";
import { EHRCareplanActivityDomainModel } from "./ehr.careplan.activity.domain.model";
import { EHRAssessmentDomainModel } from "./ehr.assessment.domain.model";
import { PatientService } from "../../services/users/patient/patient.service";
import { UserDeviceDetailsService } from "../../services/users/user/user.device.details.service";
import { Loader } from "../../startup/loader";
import { BloodGlucoseService } from "../../services/clinical/biometrics/blood.glucose.service";
import { BloodPressureService } from "../../services/clinical/biometrics/blood.pressure.service";
import { PulseService } from "../../services/clinical/biometrics/pulse.service";
import { BodyWeightService } from "../../services/clinical/biometrics/body.weight.service";
import { BodyHeightService } from "../../services/clinical/biometrics/body.height.service";
import { BodyTemperatureService } from "../../services/clinical/biometrics/body.temperature.service";
import { BloodOxygenSaturationService } from "../../services/clinical/biometrics/blood.oxygen.saturation.service";
import { LabRecordService } from "../../services/clinical/lab.record/lab.record.service";
import { StepCountService } from "../../services/wellness/daily.records/step.count.service";
import { StandService } from "../../services/wellness/daily.records/stand.service";
import { SleepService } from "../../services/wellness/daily.records/sleep.service";
import { MeditationService } from "../../services/wellness/exercise/meditation.service";
import { PhysicalActivityService } from "../../services/wellness/exercise/physical.activity.service";
import { FoodConsumptionService } from "../../services/wellness/nutrition/food.consumption.service";
import { HowDoYouFeelService } from "../../services/clinical/symptom/how.do.you.feel.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class EHRAnalyticsHandler {

    //#region Publics

    _patientService: PatientService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    _bloodGlucoseService: BloodGlucoseService = null;

    _bloodPressureService: BloodPressureService = null;

    _pulseService: PulseService = null;

    _bodyWeightService: BodyWeightService = null;

    _bodyHeightService: BodyHeightService = null;

    _bodyTemperatureService: BodyTemperatureService = null;

    _bloodOxygenSaturationService: BloodOxygenSaturationService = null;

    _labRecordService: LabRecordService = null;

    _standService: StandService = null;

    _stepCountService: StepCountService = null;

    _sleepService: SleepService = null;

    _meditationService: MeditationService = null;

    _physicalActivityService: PhysicalActivityService = null;

    _foodConsumptionService: FoodConsumptionService = null;

    _howDoYouFeelService: HowDoYouFeelService = null;

    constructor() {
        this._patientService = Loader.container.resolve(PatientService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
        this._bloodGlucoseService = Loader.container.resolve(BloodGlucoseService);
        this._bloodPressureService = Loader.container.resolve(BloodPressureService);
        this._pulseService = Loader.container.resolve(PulseService);
        this._bodyWeightService = Loader.container.resolve(BodyWeightService);
        this._bodyHeightService = Loader.container.resolve(BodyHeightService);
        this._bodyTemperatureService = Loader.container.resolve(BodyTemperatureService);
        this._bloodOxygenSaturationService = Loader.container.resolve(BloodOxygenSaturationService);
        this._labRecordService = Loader.container.resolve(LabRecordService);
        this._standService = Loader.container.resolve(StandService);
        this._stepCountService = Loader.container.resolve(StepCountService);
        this._sleepService = Loader.container.resolve(SleepService);
        this._meditationService = Loader.container.resolve(MeditationService);
        this._physicalActivityService = Loader.container.resolve(PhysicalActivityService);
        this._foodConsumptionService = Loader.container.resolve(FoodConsumptionService);
        this._howDoYouFeelService = Loader.container.resolve(HowDoYouFeelService);
    }

    static _ehrDatasetRepo: EHRAnalyticsRepo = new EHRAnalyticsRepo();

    static _numAsyncTasks = 4;

    static _q = asyncLib.queue((model: EHRDynamicRecordDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date((model.RecordDate)).toISOString()
                .split('T')[0] : null;
            await EHRAnalyticsHandler._ehrDatasetRepo.create(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _q1 = asyncLib.queue((model: EHRMedicationDomainModel, onCompleted) => {
        (async () => {
            await EHRAnalyticsHandler._ehrDatasetRepo.createMedication(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _q2 = asyncLib.queue((model: EHRCareplanActivityDomainModel, onCompleted) => {
        (async () => {
            await EHRAnalyticsHandler._ehrDatasetRepo.createCareplanActivity(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _q3 = asyncLib.queue((model: EHRCareplanActivityDomainModel, onCompleted) => {
        (async () => {
            await EHRAnalyticsHandler._ehrDatasetRepo.createAssessment(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    private static add = (model:EHRDynamicRecordDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        EHRAnalyticsHandler._q.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static addMedication = (model:EHRMedicationDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }

        EHRAnalyticsHandler._q1.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR medication record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR medication record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR medication record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static addCareplanActivity = (model:EHRCareplanActivityDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }

        EHRAnalyticsHandler._q2.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR careplan activity record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR careplan activity record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR careplan activity record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static addAssessment = (model:EHRAssessmentDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }

        EHRAnalyticsHandler._q3.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR assessment record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR assessment record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR assessment record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };


    static addOrUpdatePatient = async (
        patientUserId: uuid,
        details: EHRStaticRecordDomainModel,
        appName?: string,
    ) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        await EHRAnalyticsHandler._ehrDatasetRepo.addOrUpdatePatient(
            patientUserId, details, appName);
    };

    //#region Add records

    static addStringRecord = (
        patientUserId: uuid,
        recordId: uuid,
        provider: string,
        type: EHRRecordTypes,
        primaryValue: string,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        appName?: string,
        recordDate?: string
    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Provider      : provider ?? null,
            Type          : type,
            Name          : name ?? type,
            ValueString   : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
            AppName       : appName ?? null,
            RecordDate    : recordDate ?? null,

        };
        EHRAnalyticsHandler.add(model);
    };

    static addDateRecord = (
        patientUserId: uuid,
        recordId: uuid,
        provider: string,
        type: EHRRecordTypes,
        primaryValue: Date,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        appName?: string,
    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Provider      : provider ?? null,
            Type          : type,
            Name          : name ?? type,
            ValueDate     : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
            AppName       : appName ?? null,

        };
        EHRAnalyticsHandler.add(model);
    };

    static addIntegerRecord = (
        patientUserId: uuid,
        recordId: uuid,
        provider: string,
        type: EHRRecordTypes,
        primaryValue: number,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        appName?: string,
        recordDate?: string,

    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Provider      : provider ?? null,
            Type          : type,
            Name          : name ?? type,
            ValueInt      : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
            AppName       : appName ?? null,
            RecordDate    : recordDate ?? null,

        };
        EHRAnalyticsHandler.add(model);
    };

    static addFloatRecord = (
        patientUserId: uuid,
        recordId: uuid,
        provider: string,
        type: EHRRecordTypes,
        primaryValue: number,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        appName?: string,
        recordDate?: string,

    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Provider      : provider ?? null,
            Type          : type,
            Name          : name ?? type,
            ValueFloat    : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
            AppName       : appName ?? null,
            RecordDate    : recordDate ?? null,


        };
        EHRAnalyticsHandler.add(model);
    };

    static addBooleanRecord = (
        patientUserId: uuid,
        recordId: uuid,
        provider: string,
        type: EHRRecordTypes,
        primaryValue: boolean,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        appName?: string,
        recordDate?: string,

    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Provider      : provider ?? null,
            Type          : type,
            Name          : name ?? type,
            ValueBoolean  : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
            AppName       : appName ?? null,
            RecordDate    : recordDate ?? null,

        };
        EHRAnalyticsHandler.add(model);
    };

    static addMedicationRecord = (
        appName           : string,
        recordId          : uuid,
        patientUserId     : uuid,
        drugName          : string,
        dose              : number,
        details?          : string,
        timeScheduleStart?: Date,
        timeScheduleEnd?  : Date,
        takenAt?          : Date,
        isTaken?          : boolean,
        isMissed?         : boolean,
        isCancelled?      : boolean,
    ) => {
        var model:EHRMedicationDomainModel = {
            AppName          : appName,
            RecordId         : recordId,
            PatientUserId    : patientUserId,
            DrugName         : drugName,
            Dose             : dose,
            Details          : details,
            TimeScheduleStart: timeScheduleStart,
            TimeScheduleEnd  : timeScheduleEnd,
            TakenAt          : takenAt,
            IsTaken          : isTaken,
            IsMissed         : isMissed,
            IsCancelled      : isCancelled,

        };
        EHRAnalyticsHandler.addMedication(model);
    };

    static addCareplanActivityRecord = (
        appName            : string,
        patientUserId      : uuid,
        recordId           : uuid,
        enrollmentId       : number | string,
        provider           : string,
        planName           : string,
        planCode           : string,
        type               : string,
        category           : string,
        providerActionId   : string,
        title              : string,
        description        : string,
        url                : string,
        language           : string,
        scheduledAt        : Date,
        completedAt        : Date,
        sequence           : number,
        scheduledDay       : number,
        status             : string,
        healthSystem?      : string,
        associatedHospital?: string,
    ) => {
        var model:EHRCareplanActivityDomainModel = {
            AppName           : appName,
            RecordId          : recordId,
            PatientUserId     : patientUserId,
            EnrollmentId      : enrollmentId,
            Provider          : provider,
            PlanName          : planName,
            PlanCode          : planCode,
            Type              : type,
            Category          : category,
            ProviderActionId  : providerActionId,
            Title             : title,
            Description       : description,
            Url               : url,
            Language          : language,
            ScheduledAt       : scheduledAt,
            CompletedAt       : completedAt,
            Sequence          : sequence,
            ScheduledDay      : scheduledDay,
            Status            : status,
            HealthSystem      : healthSystem ?? null,
            AssociatedHospital: associatedHospital ?? null,

        };
        EHRAnalyticsHandler.addCareplanActivity(model);
    };

    static addAssessmentRecord = (assessmentRecord: any) => {
        var model:EHRAssessmentDomainModel = assessmentRecord;
        EHRAnalyticsHandler.addAssessment(model);
    };

    private eligibleToAddInEhrRecords = (userAppRegistrations) => {

        const eligibleToAddInEhrRecords =
        userAppRegistrations.indexOf('Heart &amp; Stroke Helper™') >= 0 ||
        userAppRegistrations.indexOf('REAN HealthGuru') >= 0 ||
        userAppRegistrations.indexOf('HF Helper') >= 0;

        return eligibleToAddInEhrRecords;
    };

    public getEligibleAppNames = async (patientUserId: uuid) => {
        const userDetails = await this._patientService.getByUserId(patientUserId);
        var appNames = [];
        if (userDetails.User.IsTestUser == false) {
            var userDevices = await this._userDeviceDetailsService.getByUserId(patientUserId);
            if (userDevices.length > 0) {
                userDevices.forEach(userDevice => {
                    var deviceEligibility = this.eligibleToAddInEhrRecords(userDevice.AppName);
                    if (deviceEligibility) {
                        appNames.push(userDevice.AppName);
                    }
                });
            }
        }
        // app is not invalidating old devices, hence considering only unique devices
        var uniqueAppNames = appNames.filter((item, i, ar) => ar.indexOf(item) === i);
        return uniqueAppNames;
    };

    public scheduleExistingDataToEHR = async (model : string) => {
        try {

            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                const filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                switch (model) {
                    case "BloodGlucose" :
                        searchResults = await this._bloodGlucoseService.search(filters);
                        for await (var r of searchResults.Items) {
                            var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                            if (eligibleAppNames.length > 0) {
                                for (var appName of eligibleAppNames) { 
                                    this._bloodGlucoseService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                }
                            } else {
                                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                            }     
                        }
                        break;
                    
                        case "BloodPressure" :
                            searchResults = await this._bloodPressureService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._bloodPressureService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "Pulse" :
                            searchResults = await this._pulseService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._pulseService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "BodyWeight" :
                            searchResults = await this._bodyWeightService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._bodyWeightService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "BodyHeight" :
                            searchResults = await this._bodyHeightService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._bodyHeightService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "BodyTemperature" :
                            searchResults = await this._bodyTemperatureService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._bodyTemperatureService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "BloodOxygenSaturation" :
                            searchResults = await this._bloodOxygenSaturationService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._bloodOxygenSaturationService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "LabValues" :
                            searchResults = await this._labRecordService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._labRecordService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "Stand" :
                            searchResults = await this._standService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._standService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "StepCount" :
                            searchResults = await this._stepCountService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._stepCountService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "PhysicalActivity" :
                            searchResults = await this._physicalActivityService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._physicalActivityService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "Sleep" :
                            searchResults = await this._sleepService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._sleepService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "Meditation" :
                            searchResults = await this._meditationService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._meditationService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "Nutrition" :
                            searchResults = await this._foodConsumptionService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._foodConsumptionService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "Symptom" :
                            searchResults = await this._howDoYouFeelService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for (var appName of eligibleAppNames) { 
                                        this._howDoYouFeelService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;
                    
                }
                pageIndex++;
                Logger.instance().log(`Processed :${searchResults.Items.length} records for ${model}`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`Error population existing data in ehr insights database.`);
        }
    };

    //#endregion

}
