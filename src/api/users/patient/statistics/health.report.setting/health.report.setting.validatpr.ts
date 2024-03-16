import express from 'express';
import { BaseValidator, Where } from '../../../../base.validator';
import { HealthReportSettingsDomainModel, ReportFrequency } from '../../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { InputValidationError } from '../../../../../common/input.validation.error';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthReportSettingValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = async (request: express.Request): Promise<HealthReportSettingsDomainModel> => {
        request.body.Preference.ReportFrequency = request.body.Preference.ReportFrequency as ReportFrequency;
        const entity: HealthReportSettingsDomainModel = {
            PatientUserId : request.body.PatientUserId,
            Preference    : request.body.Preference
        };
        return entity;
    };

    getUpdateDomainModel = async (request: express.Request): Promise<HealthReportSettingsDomainModel> => {
        request.body.Preference.ReportFrequency = request.body.Preference.ReportFrequency as ReportFrequency;
        const entity: HealthReportSettingsDomainModel = {
            Preference : request.body.Preference
        };
        return entity;
    };

    create = async (request: express.Request): Promise<HealthReportSettingsDomainModel> => {
        await this.validateBody(request, true);
        return this.getCreateDomainModel(request);
    };

    update = async (request: express.Request): Promise<HealthReportSettingsDomainModel> => {
        await this.validateUpdateBody(request);
        return this.getUpdateDomainModel(request);
    };

    private async validateBody(request: express.Request, create = true): Promise<void> {

        await this.validateUuid(request, 'PatientUserId', Where.Body, create, false);
        await this.validateString(request, 'Preference.ReportFrequency', Where.Body, true, false, false, 4);
        await this.validateBoolean(request, 'Preference.HealthJourney', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.MedicationAdherence', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.BodyWeight', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.BloodGlucose', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.BloodPressure', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.SleepHistory', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.LabValues', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.ExerciseAndPhysicalActivity', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.FoodAndNutrition', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.DailyTaskStatus', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.MoodAndSymptoms', Where.Body, true, false);
        
        this.validateRequest(request);
        if (!Object.values(ReportFrequency).includes(request.body.Preference.ReportFrequency)) {
            throw new InputValidationError(['Invalid value for report frequency']);
        }
    }

    private async validateUpdateBody(request: express.Request): Promise<void> {
        await this.validateString(request, 'Preference.ReportFrequency', Where.Body, true, false, false, 4);
        await this.validateBoolean(request, 'Preference.HealthJourney', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.MedicationAdherence', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.BodyWeight', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.BloodGlucose', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.BloodPressure', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.SleepHistory', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.LabValues', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.ExerciseAndPhysicalActivity', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.FoodAndNutrition', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.DailyTaskStatus', Where.Body, true, false);
        await this.validateBoolean(request, 'Preference.MoodAndSymptoms', Where.Body, true, false);
        
        this.validateRequest(request);

        if (!Object.values(ReportFrequency).includes(request.body.Preference.ReportFrequency)) {
            throw new InputValidationError(['Invalid value for report frequency']);
        }
    }

}
