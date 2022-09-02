
import { EHRMasterRecordsRepo } from "./ehr.master.records.repo";
import { EHRMasterRecordsDomainModel } from './ehr.master.records.domain.model';
import * as asyncLib from 'async';
import { Logger } from "../../common/logger";

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

    //#endregion

}
