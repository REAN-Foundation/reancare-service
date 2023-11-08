import { EHRDynamicRecordDomainModel, EHRStaticRecordDomainModel } from './ehr.analytics.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////

import { Logger } from "../../common/logger";
import StaticEHRData from "./models/static.ehr.data.model";
import { uuid } from '../../domain.types/miscellaneous/system.types';
import DynamicEHRData from './models/dynamic.ehr.data.model';
import EHRVitalData from './models/ehr.vital.data.model';
import EHRLabData from './models/ehr.lab.data.model';
import { EHRModels } from './ehr.record.types';

// import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////

export class EHRAnalyticsRepo {
    _modelResolver = {};

    constructor() {
        this._modelResolver = {
            'EHRVitalData': EHRVitalData,
            'EHRLabData': EHRLabData
        };
    }

    addOrUpdatePatient = async (
        patientUserId: uuid,
        details: EHRStaticRecordDomainModel,
        appName?: string,
    ) => {

        var model = await StaticEHRData.findOne({
            where : {
                PatientUserId : patientUserId,
            }
        });

        if (!model) {
            var entity = this.createModel(model, details, appName)
            entity.PatientUserId = patientUserId
            model = await StaticEHRData.create(entity);
        } else {
            model = this.createModel(model, details, appName)
            model = await model.save();
        }

        return model;
    };



    create = async (model: EHRDynamicRecordDomainModel): Promise<boolean> => {
        try {

            var targetModel = EHRModels[model.Type];
            Logger.instance().log('target model ==> ' + targetModel);

            const existing = await this._modelResolver[targetModel].findOne({
                where : {
                    PatientUserId : model.PatientUserId,
                    RecordId      : model.RecordId,
                    Type          : model.Type
                }
            });

            if (existing) {
                existing.AppName       = model.AppName;
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
                AppName       : model.AppName,
                PatientUserId : model.PatientUserId,
                RecordId      : model.RecordId,
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
            const record = await this._modelResolver[targetModel].create(entity);
            return record != null;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private createModel = (model, details, appName) => {

        if (!model) {
            model = {};
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
        if (appName) {
            model.AppName = appName;
        }
        /*if (details.PersonId) {
            model.PersonId = details.PersonId;
        }*/
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
        if (details.SelfIdentifiedGender) {
            model.SelfIdentifiedGender = details.SelfIdentifiedGender;
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
        if (details.HasHeartAilment != null) {
            model.HasHeartAilment = details.HasHeartAilment;
        }
        if (details.HasHighBloodPressure != null) {
            model.HasHighBloodPressure = details.HasHighBloodPressure;
        }
        if (details.HasHighCholesterol != null) {
            model.HasHighCholesterol = details.HasHighCholesterol;
        }
        if (details.OtherConditions) {
            model.OtherConditions = details.OtherConditions;
        }
        if (details.Occupation) {
            model.Occupation = details.Occupation;
        }
        if (details.IsDiabetic != null) {
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
        if (details.IsSmoker != null) {
            model.IsSmoker = details.IsSmoker;
        }
        if (details.Location) {
            model.Location = details.Location;
        }
        if (details.BodyHeight) {
            model.BodyHeight = details.BodyHeight;
        }

        return model;
    }
}
