
import { EHRMasterRecordsRepo } from "./ehr.master.records.repo";
import { EHRMasterRecordsDomainModel } from './ehr.master.records.domain.model';
import * as asyncLib from 'async';
import { Logger } from "../../common/logger";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EHRRecordTypes } from "./ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class EHRMasterRecordsHandler {

    //#region Publics

    static _ehrDatasetRepo: EHRMasterRecordsRepo = new EHRMasterRecordsRepo();

    static _numAsyncTasks = 4;

    static _q = asyncLib.queue((model: EHRMasterRecordsDomainModel, onCompleted) => {
        (async () => {
            model.RecordDate = (new Date()).toISOString()
                .split('T')[0];
            await EHRMasterRecordsHandler._ehrDatasetRepo.create(model);
            onCompleted(model);
        })();
    }, EHRMasterRecordsHandler._numAsyncTasks);

    static add = (model:EHRMasterRecordsDomainModel) => {
        EHRMasterRecordsHandler._q.push(model, (error, model) => {
            if (error) {
                Logger.instance().log(`Error recording EHR record: ${error.message}`);
                Logger.instance().log(`Error recording EHR record: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded EHR record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    }

    static addStringRecord = (
        patientUserId: uuid,
        type: EHRRecordTypes,
        primaryValue: string,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        secondaryValue?: string,
        secondaryUnit?: string,
        secondaryName?: string,
    ) => {
        var model:EHRMasterRecordsDomainModel = {
            PatientUserId        : patientUserId,
            Type                 : type,
            Name                 : name ?? type,
            PrimaryValueString   : primaryValue,
            PrimaryValueName     : primaryName ?? ( name ?? type),
            PrimaryValueUnit     : primaryUnit ?? null,
            SecondaryValueString : secondaryValue ?? null,
            SecondaryValueName   : secondaryName ?? null,
            SecondaryValueUnit   : secondaryUnit ?? null,
        };
        EHRMasterRecordsHandler.add(model);
    }

    static addIntegerRecord = (
        patientUserId: uuid,
        type: EHRRecordTypes,
        primaryValue: number,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        secondaryValue?: number,
        secondaryUnit?: string,
        secondaryName?: string,
    ) => {
        var model:EHRMasterRecordsDomainModel = {
            PatientUserId      : patientUserId,
            Type               : type,
            Name               : name ?? type,
            PrimaryValueInt    : primaryValue,
            PrimaryValueName   : primaryName ?? ( name ?? type),
            PrimaryValueUnit   : primaryUnit ?? null,
            SecondaryValueInt  : secondaryValue ?? null,
            SecondaryValueName : secondaryName ?? null,
            SecondaryValueUnit : secondaryUnit ?? null,
        };
        EHRMasterRecordsHandler.add(model);
    }

    static addFloatRecord = (
        patientUserId: uuid,
        type: EHRRecordTypes,
        primaryValue: number,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        secondaryValue?: number,
        secondaryUnit?: string,
        secondaryName?: string,
    ) => {
        var model:EHRMasterRecordsDomainModel = {
            PatientUserId       : patientUserId,
            Type                : type,
            Name                : name ?? type,
            PrimaryValueFloat   : primaryValue,
            PrimaryValueName    : primaryName ?? ( name ?? type),
            PrimaryValueUnit    : primaryUnit ?? null,
            SecondaryValueFloat : secondaryValue ?? null,
            SecondaryValueName  : secondaryName ?? null,
            SecondaryValueUnit  : secondaryUnit ?? null,
        };
        EHRMasterRecordsHandler.add(model);
    }

    static addBooleanRecord = (
        patientUserId: uuid,
        type: EHRRecordTypes,
        primaryValue: boolean,
        primaryUnit?: string,
        primaryName?: string,
        name?: string,
        secondaryValue?: boolean,
        secondaryUnit?: string,
        secondaryName?: string,
    ) => {
        var model:EHRMasterRecordsDomainModel = {
            PatientUserId         : patientUserId,
            Type                  : type,
            Name                  : name ?? type,
            PrimaryValueBoolean   : primaryValue,
            PrimaryValueName      : primaryName ?? ( name ?? type),
            PrimaryValueUnit      : primaryUnit ?? null,
            SecondaryValueBoolean : secondaryValue ?? null,
            SecondaryValueName    : secondaryName ?? null,
            SecondaryValueUnit    : secondaryUnit ?? null,
        };
        EHRMasterRecordsHandler.add(model);
    }

    //#endregion

}
