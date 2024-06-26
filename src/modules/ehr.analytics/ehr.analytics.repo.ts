import { EHRDynamicRecordDomainModel, EHRStaticRecordDomainModel } from './ehr.domain.models/ehr.analytics.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////

import { Logger } from "../../common/logger";
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { EHRModels } from './ehr.domain.models/ehr.record.types';
import { EHRMedicationDomainModel } from './ehr.domain.models/ehr.medication.domain.model';
import { EHRCareplanActivityDomainModel } from './ehr.domain.models/ehr.careplan.activity.domain.model';
import { EHRAssessmentDomainModel } from './ehr.domain.models/ehr.assessment.domain.model';
import StaticEHRData from "./models/static.ehr.data.model";
import EHRVitalData from './models/ehr.vital.data.model';
import EHRLabData from './models/ehr.lab.data.model';
import EHRMedicationData from './models/ehr.medication.data.model';
import EHRNutritionData from './models/ehr.nutrition.data.model';
import EHRPhysicalActivityData from './models/ehr.physical.activity.data.model';
import EHRSymptomData from './models/ehr.symptom.data.model';
import EHRMentalWellBeingData from './models/ehr.mental.wellbeing.data.model';
import EHRCareplanActivityData from './models/ehr.careplan.activity.data.model';
import EHRAssessmentData from './models/ehr.assessment.data.model';

///////////////////////////////////////////////////////////////////////////////////

export class EHRAnalyticsRepo {

    _modelResolver = {};

    constructor() {
        this._modelResolver = {
            'EHRVitalData'            : EHRVitalData,
            'EHRLabData'              : EHRLabData,
            'EHRNutritionData'        : EHRNutritionData,
            'EHRPhysicalActivityData' : EHRPhysicalActivityData,
            'EHRSymptomData'          : EHRSymptomData,
            'EHRMentalWellBeingData'  : EHRMentalWellBeingData,
        };
    }

    addOrUpdatePatient = async (
        patientUserId: uuid,
        details: EHRStaticRecordDomainModel,
        appName?: string,
    ) => {

        var staticData_arr: StaticEHRData[] = await StaticEHRData.findAll({
            where : {
                PatientUserId : patientUserId
            }
        });

        if (staticData_arr.length === 0) {
            var entity = this.createEntity(details, appName);
            entity.PatientUserId = patientUserId;
            var staticData = await StaticEHRData.create(entity);
        } else {
            for await (var staticData of staticData_arr) {
                if (staticData.DoctorPersonId_1) {
                    details.DoctorPersonId_2 = details.DoctorPersonId_1;
                    details.DoctorPersonId_1 = null;
                    staticData.DoctorPersonId_2 = details.DoctorPersonId_2;
                }
                staticData = this.updateEntity(staticData, details, appName);
                staticData = await staticData.save();
            }
        }

        return staticData;
    };

    public create = async (model: EHRDynamicRecordDomainModel): Promise<boolean> => {
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
                existing.Provider      = model.Provider;
                existing.Type          = model.Type,
                existing.Name          = model.Name,
                existing.ValueInt      = model.ValueInt;
                existing.ValueFloat    = model.ValueFloat;
                existing.ValueString   = model.ValueString;
                existing.ValueBoolean  = model.ValueBoolean;
                existing.ValueDate     = model.ValueDate;
                existing.ValueDataType = model.ValueDataType;
                existing.ValueName     = model.ValueName;
                existing.ValueUnit     = model.ValueUnit;
                existing.RecordDate    = model.RecordDate;

                await existing.save();

                return true;
            }
            const entity = {
                AppName       : model.AppName,
                PatientUserId : model.PatientUserId,
                RecordId      : model.RecordId,
                Provider      : model.Provider,
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

    public deletePatientStaticRecord = async (patientUserId: uuid) => {
        try {
            await StaticEHRData.destroy({ where: { PatientUserId: patientUserId } });
            Logger.instance().log(`EHR static record deleted : ${JSON.stringify(patientUserId)}`);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public deleteVitalsRecord = async (id: string ) => {
        try {
            await EHRVitalData.destroy({ where: { RecordId: id } });
            Logger.instance().log(`EHR vital record deleted!`);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    createMedication = async (model: EHRMedicationDomainModel): Promise<boolean> => {
        try {

            const existing = await EHRMedicationData.findOne({
                where : {
                    PatientUserId : model.PatientUserId,
                    RecordId      : model.RecordId
                }
            });

            if (existing) {
                existing.PatientUserId      = model.PatientUserId,
                existing.RecordId           = model.RecordId,
                existing.DrugName           = model.DrugName,
                existing.Dose               = model.Dose.toString(),
                existing.Details            = model.Details,
                existing.TimeScheduleStart  = model.TimeScheduleStart,
                existing.TimeScheduleEnd    = model.TimeScheduleEnd,
                existing.TakenAt            = model.TakenAt,
                existing.IsTaken            = model.IsTaken,
                existing.IsMissed           = model.IsMissed,
                existing.IsCancelled        = model.IsCancelled,
                existing.RecordDate         = model.RecordDate,

                await existing.save();

                return true;
            }

            const entity = {
                AppName           : model.AppName,
                PatientUserId     : model.PatientUserId,
                RecordId          : model.RecordId,
                DrugName          : model.DrugName,
                Dose              : model.Dose.toString(),
                Details           : model.Details,
                TimeScheduleStart : model.TimeScheduleStart,
                TimeScheduleEnd   : model.TimeScheduleEnd,
                TakenAt           : model.TakenAt,
                IsTaken           : model.IsTaken,
                IsMissed          : model.IsMissed,
                IsCancelled       : model.IsCancelled,
                RecordDate        : model.RecordDate,

            };
            const record = await EHRMedicationData.create(entity);
            return record != null;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    createCareplanActivity = async (model: EHRCareplanActivityDomainModel): Promise<boolean> => {
        try {

            const existing = await EHRCareplanActivityData.findOne({
                where : {
                    PatientUserId : model.PatientUserId,
                    RecordId      : model.RecordId,
                }
            });

            if (existing) {
                existing.PatientUserId      = model.PatientUserId,
                existing.RecordId           = model.RecordId,
                existing.EnrollmentId       = model.EnrollmentId.toString(),
                existing.Provider           = model.Provider,
                existing.PlanName           = model.PlanName,
                existing.PlanCode           = model.PlanCode,
                existing.Type               = model.Type,
                existing.Category           = model.Category,
                existing.ProviderActionId   = model.ProviderActionId,
                existing.Title              = model.Title,
                existing.Description        = model.Description,
                existing.Url                = model.Url,
                existing.Language           = 'English',
                existing.ScheduledAt        = model.ScheduledAt,
                existing.CompletedAt        = model.CompletedAt,
                existing.Sequence           = model.Sequence,
                existing.ScheduledDay       = model.ScheduledDay,
                existing.Status             = model.Status,
                existing.HealthSystem       = model.HealthSystem,
                existing.AssociatedHospital = model.AssociatedHospital,
                existing.RecordDate         = model.RecordDate,

                await existing.save();

                return true;
            }

            const entity = {
                AppName            : model.AppName,
                PatientUserId      : model.PatientUserId,
                RecordId           : model.RecordId,
                EnrollmentId       : model.EnrollmentId,
                Provider           : model.Provider,
                PlanName           : model.PlanName,
                PlanCode           : model.PlanCode,
                Type               : model.Type,
                Category           : model.Category,
                ProviderActionId   : model.ProviderActionId,
                Title              : model.Title,
                Description        : model.Description,
                Url                : model.Url,
                Language           : 'English',
                ScheduledAt        : model.ScheduledAt,
                CompletedAt        : model.CompletedAt,
                Sequence           : model.Sequence,
                ScheduledDay       : model.ScheduledDay,
                Status             : model.Status,
                HealthSystem       : model.HealthSystem,
                AssociatedHospital : model.AssociatedHospital,
                RecordDate         : model.RecordDate,

            };
            const record = await EHRCareplanActivityData.create(entity);
            return record != null;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    createAssessment = async (model: EHRAssessmentDomainModel): Promise<boolean> => {
        try {
            const entity = {
                AppName        : model.AppName,
                PatientUserId  : model.PatientUserId,
                AssessmentId   : model.AssessmentId,
                TemplateId     : model.TemplateId,
                NodeId         : model.NodeId,
                Title          : model.Title,
                Question       : model.Question,
                SubQuestion    : model.SubQuestion,
                QuestionType   : model.QuestionType,
                AnswerOptions  : model.AnswerOptions,
                AnswerValue    : model.AnswerValue,
                AnswerReceived : model.AnswerReceived,
                AnsweredOn     : model.AnsweredOn,
                Status         : model.Status,
                Score          : model.Score,
                AdditionalInfo : model.AdditionalInfo,
                StartedAt      : model.StartedAt,
                FinishedAt     : model.FinishedAt,
                RecordDate     : model.RecordDate

            };
            const record = await EHRAssessmentData.create(entity);
            return record != null;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private createEntity = (details: EHRStaticRecordDomainModel, appName?: string) => {

        var model: any = {};

        if (details.DoctorPersonId_1) {
            model.DoctorPersonId_1 = details.DoctorPersonId_1;
        }
        if (details.DoctorPersonId_2) {
            model.DoctorPersonId_2 = details.DoctorPersonId_2;
        }

        if (details.ProviderCode) {
            model.ProviderCode = details.ProviderCode;
        }
        if (appName) {
            model.AppName = appName;
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
        if (details.DoctorPersonId_1) {
            model.DoctorPersonId_1 = details.DoctorPersonId_1;
        }
        if (details.DoctorPersonId_2) {
            model.DoctorPersonId_2 = details.DoctorPersonId_2;
        }
        if (details.RecordDate) {
            model.RecordDate = details.RecordDate;
        }

        return model;
    };

    private updateEntity = (model: StaticEHRData, details: EHRStaticRecordDomainModel, appName?: string) => {

        if (details.DoctorPersonId_1) {
            model.DoctorPersonId_1 = details.DoctorPersonId_1;
        }
        if (details.DoctorPersonId_2) {
            model.DoctorPersonId_2 = details.DoctorPersonId_2;
        }
        if (details.ProviderCode) {
            model.ProviderCode = details.ProviderCode;
        }
        if (appName) {
            model.AppName = appName;
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
        if (details.DoctorPersonId_1) {
            model.DoctorPersonId_1 = details.DoctorPersonId_1;
        }
        if (details.DoctorPersonId_2) {
            model.DoctorPersonId_2 = details.DoctorPersonId_2;
        }
        if (details.RecordDate) {
            model.RecordDate = details.RecordDate;
        }

        return model;
    };

}
