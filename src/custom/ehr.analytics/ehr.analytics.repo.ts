import { EHRDynamicRecordDomainModel, EHRStaticRecordDomainModel } from './ehr.analytics.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////

import { Logger } from "../../common/logger";
import StaticEHRData from "./models/static.ehr.data.model";
import { uuid } from '../../domain.types/miscellaneous/system.types';
import DynamicEHRData from './models/dynamic.ehr.data.model';

// import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////

export class EHRAnalyticsRepo {

    addOrUpdatePatient = async (
        patientUserId: uuid,
        details: EHRStaticRecordDomainModel
    ) => {

        var model = await StaticEHRData.findOne({
            where : {
                PatientUserId : patientUserId
            }
        });
        if (!model) {
            model = await StaticEHRData.create({
                PatientUserId : patientUserId
            });
        }
        if (model.DoctorPersonId_1 === null) {
            model.DoctorPersonId_1 = details.DoctorPersonId;
        }
        else if (model.DoctorPersonId_2 === null) {
            model.DoctorPersonId_2 = details.DoctorPersonId;
        }
        else if (details.OtherDoctorPersonId !== null) {
            if (model.DoctorPersonId_1 === details.OtherDoctorPersonId) {
                model.DoctorPersonId_1 = details.DoctorPersonId;
            }
            if (model.DoctorPersonId_2 === details.OtherDoctorPersonId) {
                model.DoctorPersonId_2 = details.DoctorPersonId;
            }
        }
        if (details.ProviderCode) {
            model.ProviderCode = details.ProviderCode;
        }
        if (details.MajorAilment) {
            model.MajorAilment = details.MajorAilment;
        }
        if (details.HealthSystem) {
            model.HealthSystem = details.HealthSystem;
        }
        if (details.AssociatedHospital) {
            model.AssociatedHospital = details.AssociatedHospital;
        }
        if (details.Gender) {
            model.Gender = details.Gender;
        }
        if (details.BirthDate) {
            model.BirthDate = details.BirthDate;
        }
        if (details.Age) {
            model.Age = details.Age;
        }
        if (details.Ethnicity) {
            model.Ethnicity = details.Ethnicity;
        }
        if (details.Race) {
            model.Race = details.Race;
        }
        if (details.Nationality) {
            model.Nationality = details.Nationality;
        }
        if (details.HasHeartAilment) {
            model.HasHeartAilment = details.HasHeartAilment;
        }
        if (details.IsDiabetic) {
            model.IsDiabetic = details.IsDiabetic;
        }
        if (details.MaritalStatus) {
            model.MaritalStatus = details.MaritalStatus;
        }
        if (details.BloodGroup) {
            model.BloodGroup = details.BloodGroup;
        }
        if (details.MajorAilment) {
            model.MajorAilment = details.MajorAilment;
        }
        if (details.IsSmoker) {
            model.IsSmoker = details.IsSmoker;
        }
        if (details.Location) {
            model.Location = details.Location;
        }
        if (details.BodyHeight) {
            model.BodyHeight = details.BodyHeight;
        }
        model = await model.save();
        return model;
    };

    create = async (model: EHRDynamicRecordDomainModel): Promise<boolean> => {
        try {

            const existing = await DynamicEHRData.findOne({
                where : {
                    PatientUserId : model.PatientUserId,
                    RecordId      : model.RecordId,
                    Type          : model.Type
                }
            });
            if (existing) {
                existing.ValueInt      = model.ValueInt;
                existing.ValueFloat    = model.ValueFloat;
                existing.ValueString   = model.ValueString;
                existing.ValueBoolean  = model.ValueBoolean;
                existing.ValueDate     = model.ValueDate;
                existing.ValueDataType = model.ValueDataType;
                existing.ValueName     = model.ValueName;
                existing.ValueUnit     = model.ValueUnit;

                await existing.save();

                return true;
            }
            const entity = {
                PatientUserId : model.PatientUserId,
                Type          : model.Type,
                Name          : model.Name,
                ValueInt      : model.ValueInt,
                ValueFloat    : model.ValueFloat,
                ValueString   : model.ValueString,
                ValueBoolean  : model.ValueBoolean,
                ValueDate     : model.ValueDate,
                ValueDataType : model.ValueDataType,
                ValueName     : model.ValueName,
                ValueUnit     : model.ValueUnit,
                RecordDate    : model.RecordDate,
            };
            const record = await DynamicEHRData.create(entity);
            return record != null;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
