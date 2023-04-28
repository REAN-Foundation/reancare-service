
import { EHRAnalyticsRepo } from "./ehr.analytics.repo";
import {
    EHRDynamicRecordDomainModel,
    EHRStaticRecordDomainModel
} from './ehr.analytics.domain.model';
import * as asyncLib from 'async';
import { Logger } from "../../common/logger";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EHRRecordTypes } from "./ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class EHRAnalyticsHandler {

    //#region Publics

    static _ehrDatasetRepo: EHRAnalyticsRepo = new EHRAnalyticsRepo();

    static _numAsyncTasks = 4;

    static _q = asyncLib.queue((model: EHRDynamicRecordDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = (new Date()).toISOString()
                .split('T')[0];
            await EHRAnalyticsHandler._ehrDatasetRepo.create(model);
            onCompleted(model);
        })();
    }, EHRAnalyticsHandler._numAsyncTasks);

    private static add = (model:EHRDynamicRecordDomainModel) => {
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

    static addOrUpdatePatient = async (
        patientUserId: uuid,
        details: EHRStaticRecordDomainModel
    ) => {
        await EHRAnalyticsHandler._ehrDatasetRepo.addOrUpdatePatient(
            patientUserId, details);
    };

    //#region Add records

    static addStringRecord = (
        patientUserId: uuid,
        recordId: uuid,
        type: EHRRecordTypes,
        primaryValue: string,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Type          : type,
            Name          : name ?? type,
            ValueString   : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
        };
        EHRAnalyticsHandler.add(model);
    };

    static addDateRecord = (
        patientUserId: uuid,
        recordId: uuid,
        type: EHRRecordTypes,
        primaryValue: Date,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Type          : type,
            Name          : name ?? type,
            ValueDate     : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
        };
        EHRAnalyticsHandler.add(model);
    };

    static addIntegerRecord = (
        patientUserId: uuid,
        recordId: uuid,
        type: EHRRecordTypes,
        primaryValue: number,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Type          : type,
            Name          : name ?? type,
            ValueInt      : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
        };
        EHRAnalyticsHandler.add(model);
    };

    static addFloatRecord = (
        patientUserId: uuid,
        recordId: uuid,
        type: EHRRecordTypes,
        primaryValue: number,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Type          : type,
            Name          : name ?? type,
            ValueFloat    : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
        };
        EHRAnalyticsHandler.add(model);
    };

    static addBooleanRecord = (
        patientUserId: uuid,
        recordId: uuid,
        type: EHRRecordTypes,
        primaryValue: boolean,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
    ) => {
        var model:EHRDynamicRecordDomainModel = {
            PatientUserId : patientUserId,
            RecordId      : recordId,
            Type          : type,
            Name          : name ?? type,
            ValueBoolean  : primaryValue,
            ValueName     : primaryName ?? ( name ?? type),
            ValueUnit     : primaryUnit ?? null,
        };
        EHRAnalyticsHandler.add(model);
    };

    //#endregion

}
