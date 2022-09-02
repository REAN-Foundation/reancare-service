import { EHRMasterRecordsDomainModel } from './ehr.master.records.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////

import { Logger } from "../../common/logger";
import EHRMasterRecord from "./models/ehr.record.set.model";
// import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////

export class EHRMasterRecordsRepo {

    create = async (model: EHRMasterRecordsDomainModel): Promise<boolean> => {
        try {
            const entity = {
                PatientUserId : model.PatientUserId,
                Type          : model.Type,
                Name          : model.Name,

                PrimaryValueInt      : model.PrimaryValueInt,
                PrimaryValueFloat    : model.PrimaryValueFloat,
                PrimaryValueString   : model.PrimaryValueString,
                PrimaryValueDataType : model.PrimaryValueDataType,
                PrimaryValueName     : model.PrimaryValueName,
                PrimaryValueUnit     : model.PrimaryValueUnit,

                SecondaryValueInt      : model.SecondaryValueInt,
                SecondaryValueFloat    : model.SecondaryValueFloat,
                SecondaryValueString   : model.SecondaryValueString,
                SecondaryValueDataType : model.SecondaryValueDataType,
                SecondaryValueName     : model.SecondaryValueName,
                SecondaryValueUnit     : model.SecondaryValueUnit,

                RecordDate : model.RecordDate,
            };
            const record = await EHRMasterRecord.create(entity);
            return record != null;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
