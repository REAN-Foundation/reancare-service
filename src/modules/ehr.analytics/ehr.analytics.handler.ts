
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
import { EmergencyContactService } from "../../services/users/patient/emergency.contact.service";
import StaticEHRData from "./models/static.ehr.data.model";
import { UserService } from "../../services/users/user/user.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class EHRAnalyticsHandler {

    //#region Publics

    _userService: UserService = null;

    _patientService: PatientService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    _emergencyContactService: EmergencyContactService = null;

    constructor() {
        this._userService = Loader.container.resolve(UserService);
        this._patientService = Loader.container.resolve(PatientService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
        this._emergencyContactService = Loader.container.resolve(EmergencyContactService);
    }

    static _ehrDatasetRepo: EHRAnalyticsRepo = new EHRAnalyticsRepo();

    static _numAsyncTasks = 4;

    static _q = asyncLib.queue((model: EHRDynamicRecordDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = model.RecordDate ? new Date(model.RecordDate) : null;
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
        patientUserId: uuid,
        recordId: uuid,
        provider: string,
        type: EHRRecordTypes,
        primaryValue: number,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        appName?: string,
        recordDate?: Date,

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
        recordDate?: Date,

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
        recordDate?: Date,

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
            RecordDate       : recordDate,

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
            RecordDate        : recordDate ?? null,

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
        const userDetails = await this._userService.getById(patientUserId);
        var appNames = [];
        if (userDetails == null) {
            return appNames;
        }

        if (userDetails && userDetails.IsTestUser == false) {
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

    public scheduleExistingStaticDataToEHR = async () => {
        try {
            var patientUserIds = await this._patientService.getAllPatientUserIds();
            Logger.instance().log(`[ScheduleExistingStaticDataToEHR] Patient User Ids: ${JSON.stringify(patientUserIds)}`);

            for await (var p of patientUserIds) {
                var eligibleAppNames = await this.getEligibleAppNames(p);
                if (eligibleAppNames.length > 0) {
                    for await (var appName of eligibleAppNames) { 
                        var patientDetails = await this._patientService.getByUserId(p);
                        if (patientDetails != null) {
                            var emergencyDetails = await this._emergencyContactService.search({"PatientUserId": p});
                            var i = 1;
                            for await (var e of emergencyDetails.Items) {
                                if (e.ContactRelation === 'Doctor') {
                                    patientDetails[`DoctorPersonId_${i}`] = e.ContactPersonId;
                                    i++;
                                }
                            }
                            this._patientService.addEHRRecord(patientDetails.UserId, patientDetails.User.Person, patientDetails, null, patientDetails.HealthProfile, appName);
                        } else {
                            Logger.instance().log(`[ScheduleExistingStaticDataToEHR] Skip adding details to EHR database as Patient details not found:${p}`);
                        }
                    }
                } else {
                    Logger.instance().log(`[ScheduleExistingStaticDataToEHR] Skip adding details to EHR database as device is not eligible:${p}`);
                }      
            }
            Logger.instance().log(`[ScheduleExistingStaticDataToEHR] Processed ${patientDetails.UserId} for static data`);
            
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingStaticDataToEHR] Error population existing static data in ehr insights database: ${JSON.stringify(error)}`);
        }
          
    };

    deleteStaticEHRRecord = async (id: string ) => {
        try {
            const results = await StaticEHRData.destroy({ where: { PatientUserId: id} });
            Logger.instance().log(`EHR static record deleted : ${JSON.stringify(id)}`);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };


    //#endregion

}
