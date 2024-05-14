
import { EHRAnalyticsRepo } from "./ehr.analytics.repo";
import {
    EHRDynamicRecordDomainModel,
    EHRStaticRecordDomainModel
} from './ehr.domain.models/ehr.analytics.domain.model';
import * as asyncLib from 'async';
import { Logger } from "../../common/logger";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EHRRecordTypes } from "./ehr.domain.models/ehr.record.types";
import { ConfigurationManager } from "../../config/configuration.manager";
import { EHRMedicationDomainModel } from "./ehr.domain.models/ehr.medication.domain.model";
import { EHRCareplanActivityDomainModel } from "./ehr.domain.models/ehr.careplan.activity.domain.model";
import { EHRAssessmentDomainModel } from "./ehr.domain.models/ehr.assessment.domain.model";
import { Injector } from "../../startup/injector";
import { UserService } from "../../services/users/user/user.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class EHRAnalyticsHandler {

    static _ehrAnalyticsRepo: EHRAnalyticsRepo = new EHRAnalyticsRepo();

    static _numAsyncTasks = 4;

    //#region Async task queues

    static _queueGeneral = asyncLib.queue((model: EHRDynamicRecordDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date(model.RecordDate) : null;
            await EHRAnalyticsHandler._ehrAnalyticsRepo.create(model);
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

    private static add = (model:EHRDynamicRecordDomainModel) => {
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

    static addStringRecord = async (
        patientUserId: uuid,
        recordId     : uuid,
        provider     : string,
        type         : EHRRecordTypes,
        primaryValue : string,
        primaryUnit? : string,
        primaryName? : string,
        name?        : string,
        appName?     : string,
        recordDate?  : Date
    ) => {
        var eligible = await EHRAnalyticsHandler.checkUserEligiblity(patientUserId);
        if (eligible) {
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
        }
    };

    static addDateRecord = (
        patientUserId: uuid,
        recordId     : uuid,
        provider     : string,
        type         : EHRRecordTypes,
        primaryValue : Date,
        primaryUnit? : string,
        primaryName? : string,
        name?        : string,
        appName?     : string,
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

    static addIntegerRecord = async (
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
        var eligible = await EHRAnalyticsHandler.checkUserEligiblity(patientUserId);
        if (eligible) {
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
        }
    };

    static addFloatRecord = async (
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
        var eligible = await EHRAnalyticsHandler.checkUserEligiblity(patientUserId);
        if (eligible) {
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
        }
    };

    static addBooleanRecord = async (
        patientUserId : uuid,
        recordId      : uuid,
        provider      : string,
        type          : EHRRecordTypes,
        primaryValue  : boolean,
        primaryUnit  ?: string,
        primaryName  ?: string,
        name         ?: string,
        appName      ?: string,
        recordDate   ?: Date,

    ) => {
        var eligible = await EHRAnalyticsHandler.checkUserEligiblity(patientUserId);
        if (eligible) {
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
        }
    };

    static addMedicationRecord = async (
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
        var eligible = await EHRAnalyticsHandler.checkUserEligiblity(patientUserId);
        if (eligible) {
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
        }
    };

    static addCareplanActivityRecord = async (
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
        var eligible = await EHRAnalyticsHandler.checkUserEligiblity(patientUserId);
        if (eligible) {
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
        }
    };

    static addAssessmentRecord = async (assessmentRecord: any) => {
        var eligible = await EHRAnalyticsHandler.checkUserEligiblity(assessmentRecord.PatientUserId);
        if (eligible) {
            var model:EHRAssessmentDomainModel = assessmentRecord;
            EHRAnalyticsHandler.addAssessment(model);
        }
    };

    static checkUserEligiblity = async (patientUserId: string) => {
        
        var userService = Injector.Container.resolve(UserService);
        const userDetails = await userService.getById(patientUserId);

        if (userDetails && userDetails.IsTestUser == false) {
            return true;
        }
        return false;
    };

}
