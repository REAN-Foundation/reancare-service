import { EHRMasterRecordsDomainModel } from './ehr.master.records.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////

import { Logger } from "../../common/logger";
import EHRMasterRecord from "./models/ehr.record.set.model";
import ProviderPatientMapping from "./models/provider.patient.mapping.model";
import { uuid } from '../../domain.types/miscellaneous/system.types';

// import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////

export class EHRMasterRecordsRepo {

    addOrUpdatePatient = async (
        patientUserId: uuid,
        doctorPersonId?: uuid,
        tobeReplacedDoctorPersonId?: uuid,
        providerCode?: string,
        healthSystem?: string) => {

        var patientMapping = await ProviderPatientMapping.findOne({
            where : {
                PatientUserId : patientUserId
            }
        });
        if (!patientMapping) {
            patientMapping = await ProviderPatientMapping.create({
                PatientUserId : patientUserId
            });
        }

        if (patientMapping.DoctorPersonId_1 === null) {
            patientMapping.DoctorPersonId_1 = doctorPersonId;
        }
        else if (patientMapping.DoctorPersonId_2 !== null) {
            patientMapping.DoctorPersonId_2 = doctorPersonId;
        }
        else if (tobeReplacedDoctorPersonId !== null) {
            if (patientMapping.DoctorPersonId_1 === tobeReplacedDoctorPersonId) {
                patientMapping.DoctorPersonId_1 = doctorPersonId;
            }
            if (patientMapping.DoctorPersonId_2 === tobeReplacedDoctorPersonId) {
                patientMapping.DoctorPersonId_2 = doctorPersonId;
            }
        }
        if (providerCode) {
            patientMapping.ProviderCode = providerCode;
        }
        if (healthSystem) {
            patientMapping.HealthSystem = healthSystem;
        }
    }

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
