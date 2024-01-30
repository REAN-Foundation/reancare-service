
import { EHRAnalyticsRepo } from "./ehr.analytics.repo";
import {
    EHRDynamicRecordDomainModel,
    EHRLabsDomainModel,
    EHRMentalWellbeingDomainModel,
    EHRNutritionsDomainModel,
    EHRPhysicalActivityDomainModel,
    EHRStaticRecordDomainModel,
    EHRSymptomsDomainModel,
    EHRVitalsDomainModel
} from './ehr.domain.models/ehr.analytics.domain.model';
import * as asyncLib from 'async';
import { Logger } from "../../common/logger";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EHRRecordTypes } from "./ehr.domain.models/ehr.record.types";
import { ConfigurationManager } from "../../config/configuration.manager";
import { EHRMedicationDomainModel } from "./ehr.domain.models/ehr.medication.domain.model";
import { EHRCareplanActivityDomainModel } from "./ehr.domain.models/ehr.careplan.activity.domain.model";
import { EHRAssessmentDomainModel } from "./ehr.domain.models/ehr.assessment.domain.model";
import { UserService } from "../../services/users/user/user.service";
import { Injector } from "../../startup/injector";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class EHRAnalyticsHandler {

    static _ehrAnalyticsRepo: EHRAnalyticsRepo = new EHRAnalyticsRepo();

    static _numAsyncTasks = 4;

    //#region Async task queues

    static _queueGeneral = asyncLib.queue((model: EHRVitalsDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date(model.RecordDate) : null;
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createVitalRecord(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _queueMentalWellbeing = asyncLib.queue((model: EHRMentalWellbeingDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date(model.RecordDate) : null;
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createMentalWellbeingRecord(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _queuePhysicalActivity = asyncLib.queue((model: EHRPhysicalActivityDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date(model.RecordDate) : null;
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createPhysicalActivityRecord(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _queueSymptom = asyncLib.queue((model: EHRSymptomsDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date(model.RecordDate) : null;
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createSymptomRecord(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _queueLab = asyncLib.queue((model: EHRLabsDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date(model.RecordDate) : null;
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createLabRecord(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _queueNutrition = asyncLib.queue((model: EHRNutritionsDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date(model.RecordDate) : null;
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createNutritionRecord(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _queueMeds = asyncLib.queue((model: EHRMedicationDomainModel, onCompleted) => {
        (async () => {
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createMedication(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _queueCareplans = asyncLib.queue((model: EHRCareplanActivityDomainModel, onCompleted) => {
        (async () => {
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createCareplanActivity(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    static _queueAssessments = asyncLib.queue((model: EHRAssessmentDomainModel, onCompleted) => {
        (async () => {
            await EHRAnalyticsHandler._ehrAnalyticsRepo.createAssessment(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    private static add = (model:EHRVitalsDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        EHRAnalyticsHandler._queueGeneral.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static addMentalWellbeing = (model:EHRMentalWellbeingDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        EHRAnalyticsHandler._queueMentalWellbeing.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static addPhysicalActivity = (model:EHRPhysicalActivityDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        EHRAnalyticsHandler._queuePhysicalActivity.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static addSymptom = (model:EHRSymptomsDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        EHRAnalyticsHandler._queueSymptom.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static addLab = (model:EHRLabsDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        EHRAnalyticsHandler._queueLab.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static addNutrition = (model:EHRNutritionsDomainModel) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        EHRAnalyticsHandler._queueNutrition.push(model, (model, error) => {
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
        EHRAnalyticsHandler._queueMeds.push(model, (model, error) => {
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

        EHRAnalyticsHandler._queueCareplans.push(model, (model, error) => {
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
        EHRAnalyticsHandler._queueAssessments.push(model, (model, error) => {
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
        await EHRAnalyticsHandler._ehrAnalyticsRepo.addOrUpdatePatient(
            patientUserId, details, appName);
    };

    static deletePatientStaticRecord = async (patientUserId: uuid) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        await EHRAnalyticsHandler._ehrAnalyticsRepo.deletePatientStaticRecord(patientUserId);
    };

    static deleteVitalsRecord = async (recordId: uuid) => {
        if (ConfigurationManager.EHRAnalyticsEnabled() === false) {
            return;
        }
        await EHRAnalyticsHandler._ehrAnalyticsRepo.deleteVitalsRecord(recordId);
    };

    //#region Add records

    /*static addStringRecord = (
        patientUserId: uuid,
        recordId: uuid,
        provider: string,
        type: EHRRecordTypes,
        primaryValue: string,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        appName?: string,
        recordDate?: Date
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
        patientUserId : uuid,
        recordId      : uuid,
        provider      : string,
        type          : EHRRecordTypes,
        primaryValue  : number,
        primaryUnit  ?: string,
        primaryName  ?: string,
        name         ?: string,
        appName      ?: string,
        recordDate   ?: Date,
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
    };*/

    static addVitalRecord = async (
        patientUserId          : uuid,
        recordId               : uuid,
        provider               : string,
        type                   : EHRRecordTypes,
        bloodGlucose           : number,
        bloodPressureSystolic  : number,
        bloodPressureDiastolic : number,
        pulse                  : number,
        bloodOxygenSaturation  : number,
        bodyWeight             : number,
        bodyTemperature        : number,
        bodyHeight             : number,
        primaryUnit?           : string,
        appNames?              : string,
        recordDate?            : Date,
    ) => {
        
        var eligible = await EHRAnalyticsHandler.checkAppEligiblity(appNames, patientUserId);
        if (eligible) {
            var model:EHRVitalsDomainModel = {
                PatientUserId         : patientUserId,
                RecordId              : recordId,
                Provider              : provider ?? null,
                VitalType             : type,
                BloodGlucose          : bloodGlucose ?? null,
                BloodPressureSystolic : bloodPressureSystolic ?? null,
                BloodPressureDiastolic: bloodPressureDiastolic ?? null,
                Pulse                 : pulse ?? null,
                BloodOxygenSaturation : bloodOxygenSaturation ?? null,
                BodyWeight            : bodyWeight ?? null,
                BodyTemperature       : bodyTemperature ?? null,
                BodyHeight            : bodyHeight ?? null,
                Unit                  : primaryUnit ?? null,
                AppNames              : appNames ?? null,
                RecordDate            : recordDate ?? null,
    
            };
            EHRAnalyticsHandler.add(model);
        }
    };

    static addMentalWellbeingRecord = async(
        patientUserId          : uuid,
        recordId               : uuid,
        provider               : string,
        type                   : EHRRecordTypes,
        sleepMins              : number,
        meditationMins         : number,
        primaryUnit?           : string,
        appNames?               : string,
        recordDate?            : Date,
    ) => {
        var eligible = await EHRAnalyticsHandler.checkAppEligiblity(appNames, patientUserId);
        if (eligible) {
            var model:EHRMentalWellbeingDomainModel = {
                PatientUserId  : patientUserId,
                RecordId       : recordId,
                Provider       : provider ?? null,
                Type           : type,
                SleepMins      : sleepMins ?? null,
                MeditationMins : meditationMins ?? null,
                Unit           : primaryUnit ?? null,
                AppNames       : appNames ?? null,
                RecordDate     : recordDate ?? null,
    
            };
            EHRAnalyticsHandler.addMentalWellbeing(model);
        }
    };

    static addPhysicalActivityRecord = async (
        patientUserId               : uuid,
        recordId                    : uuid,
        provider                    : string,
        type                        : EHRRecordTypes,
        stepCounts                  : number,
        standMins                   : number,
        exerciseMins                : number,
        physicalActivityQuestion    : string,
        physicalActivityUserResponse: boolean,
        primaryUnit?                : string,
        appNames?                   : string,
        recordDate?                 : Date,
    ) => {
        var eligible = await EHRAnalyticsHandler.checkAppEligiblity(appNames, patientUserId);
        if (eligible) {
            var model:EHRPhysicalActivityDomainModel = {
                PatientUserId               : patientUserId,
                RecordId                    : recordId,
                Provider                    : provider ?? null,
                Type                        : type,
                StepCounts                  : stepCounts ?? null,
                StandMins                   : standMins ?? null,
                ExerciseMins                : exerciseMins ?? null,
                PhysicalActivityQuestion    : physicalActivityQuestion ?? null,
                PhysicalActivityUserResponse: physicalActivityUserResponse ?? null,
                Unit                        : primaryUnit ?? null,
                AppNames                    : appNames ?? null,
                RecordDate                  : recordDate ?? null,
    
            };
            EHRAnalyticsHandler.addPhysicalActivity(model);
        }
    };

    static addSymptomRecord = async (
        patientUserId              : uuid,
        recordId                   : uuid,
        provider                   : string,
        type                       : EHRRecordTypes,
        mood                       : string,
        feeling                    : string,
        energyLevels               : string,
        symptomQuestion            : string,
        symptomQuestionUserResponse: string,
        primaryUnit?               : string,
        appNames?                  : string,
        recordDate?                : Date,
    ) => {
        var eligible = await EHRAnalyticsHandler.checkAppEligiblity(appNames, patientUserId);
        if (eligible) {
            var model:EHRSymptomsDomainModel = {
                PatientUserId              : patientUserId,
                RecordId                   : recordId,
                Provider                   : provider ?? null,
                Type                       : type,
                Mood                       : mood ?? null,
                Feeling                    : feeling ?? null,
                EnergyLevels               : energyLevels ?? null,
                SymptomQuestion            : symptomQuestion ?? null,
                SymptomQuestionUserResponse: symptomQuestionUserResponse ?? null,
                Unit                       : primaryUnit ?? null,
                AppNames                   : appNames ?? null,
                RecordDate                 : recordDate ?? null,
    
            };
            EHRAnalyticsHandler.addSymptom(model);
        }
    };

    static addLabRecord = async (
        patientUserId    : uuid,
        recordId         : uuid,
        provider         : string,
        type             : EHRRecordTypes,
        totalCholesterol : number,
        hdl              : number,
        ldl              : number,
        lipoprotein      : number,
        a1cLevel         : number,
        triglycerideLevel: number,
        cholesterolRatio : number,
        primaryUnit?     : string,
        appNames?        : string,
        recordDate?      : Date,
    ) => {
        var eligible = await EHRAnalyticsHandler.checkAppEligiblity(appNames, patientUserId);
        if (eligible) {
            var model:EHRLabsDomainModel = {
                PatientUserId    : patientUserId,
                RecordId         : recordId,
                Provider         : provider ?? null,
                Type             : type,
                TotalCholesterol : totalCholesterol ?? null,
                HDL              : hdl ?? null,
                LDL              : ldl ?? null,
                Lipoprotein      : lipoprotein ?? null,
                A1CLevel         : a1cLevel ?? null,
                TriglycerideLevel: triglycerideLevel ?? null,
                CholesterolRatio : cholesterolRatio ?? null,
                Unit             : primaryUnit ?? null,
                AppNames         : appNames ?? null,
                RecordDate       : recordDate ?? null,
    
            };
            EHRAnalyticsHandler.addLab(model);
        }
    };

    static addNutritionRecord = async (
        patientUserId                : uuid,
        recordId                     : uuid,
        provider                     : string,
        type                         : EHRRecordTypes,
        nutritionQuestion            : string,
        nutritionQuestionUserResponse: boolean,
        fruitCups                    : number,
        sugaryDrinkServings          : number,
        vegetableCups                : number,
        takenSalt                    : boolean,
        seaFoodServings              : number,
        grainServings                : number,
        takenProteins                : boolean,
        primaryUnit?                 : string,
        appNames?                    : string,
        recordDate?                  : Date,
    ) => {
        var eligible = await EHRAnalyticsHandler.checkAppEligiblity(appNames, patientUserId);
        if (eligible) {
            var model:EHRNutritionsDomainModel = {
                PatientUserId                : patientUserId,
                RecordId                     : recordId,
                Provider                     : provider ?? null,
                Type                         : type,
                NutritionQuestion            : nutritionQuestion ?? null,
                NutritionQuestionUserResponse: nutritionQuestionUserResponse ?? null,
                FruitCups                    : fruitCups ?? null,
                SugaryDrinkServings          : sugaryDrinkServings ?? null,
                VegetableCups                : vegetableCups ?? null,
                TakenSalt                    : takenSalt ?? null,
                SeaFoodServings              : seaFoodServings ?? null,
                GrainServings                : grainServings ?? null,
                TakenProteins                : takenProteins ?? null,
                ServingUnit                  : primaryUnit ?? null,
                AppNames                     : appNames ?? null,
                RecordDate                   : recordDate ?? null,
    
            };
            EHRAnalyticsHandler.addNutrition(model);
        }
    };

    static addMedicationRecord = (
        appName           : string,
        recordId          : uuid,
        patientUserId     : uuid,
        drugName          : string,
        dose              : string,
        details?          : string,
        timeScheduleStart?: Date,
        timeScheduleEnd?  : Date,
        takenAt?          : Date,
        isTaken?          : boolean,
        isMissed?         : boolean,
        isCancelled?      : boolean,
        recordDate?       : Date
    ) => {
        var model:EHRMedicationDomainModel = {
            AppName           : appName,
            RecordId          : recordId,
            PatientUserId     : patientUserId,
            DrugName          : drugName,
            Dose              : dose,
            Details           : details,
            TimeScheduleStart : timeScheduleStart,
            TimeScheduleEnd   : timeScheduleEnd,
            TakenAt           : takenAt,
            IsTaken           : isTaken,
            IsMissed          : isMissed,
            IsCancelled       : isCancelled,
            RecordDate        : recordDate,

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
        recordDate?        : Date
    ) => {
        var model:EHRCareplanActivityDomainModel = {
            AppName            : appName,
            RecordId           : recordId,
            PatientUserId      : patientUserId,
            EnrollmentId       : enrollmentId,
            Provider           : provider,
            PlanName           : planName,
            PlanCode           : planCode,
            Type               : type,
            Category           : category,
            ProviderActionId   : providerActionId,
            Title              : title,
            Description        : description,
            Url                : url,
            Language           : language,
            ScheduledAt        : scheduledAt,
            CompletedAt        : completedAt,
            Sequence           : sequence,
            ScheduledDay       : scheduledDay,
            Status             : status,
            HealthSystem       : healthSystem ?? null,
            AssociatedHospital : associatedHospital ?? null,
            RecordDate         : recordDate ?? null,

        };
        EHRAnalyticsHandler.addCareplanActivity(model);
    };

    static addAssessmentRecord = (assessmentRecord: any) => {
        var model:EHRAssessmentDomainModel = assessmentRecord;
        EHRAnalyticsHandler.addAssessment(model);
    };

    static checkAppEligiblity = async (appNames: string, patientUserId: string) => {
        if (appNames.length === 0) {
            return false;
        } else {
            const eligibleToAddInEhrRecords =
            appNames.indexOf('Heart &amp; Stroke Helper™') >= 0 ||
            appNames.indexOf('REAN HealthGuru') >= 0 ||
            appNames.indexOf('HF Helper') >= 0;

            var userService = Injector.Container.resolve(UserService);
            const userDetails = await userService.getById(patientUserId);

            return eligibleToAddInEhrRecords && !userDetails.IsTestUser;
        }
    };

}
