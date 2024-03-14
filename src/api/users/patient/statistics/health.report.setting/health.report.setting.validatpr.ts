import express from 'express';
import { BaseValidator, Where } from '../../../../base.validator';
import { HealthReportSettingDomainModel } from '../../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthReportSettingValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = async (request: express.Request): Promise<HealthReportSettingDomainModel> => {

        const entity: HealthReportSettingDomainModel = {
            PatientUserId : request.body.PatientUserId,
            Preference    : request.body.Preference
        };
        return entity;
    };

    getUpdateDomainModel = async (request: express.Request): Promise<HealthReportSettingDomainModel> => {

        const entity: HealthReportSettingDomainModel = {
            Preference : request.body.Preference
        };
        return entity;
    };

    create = async (request: express.Request): Promise<HealthReportSettingDomainModel> => {
        await this.validateBody(request, true);
        return this.getCreateDomainModel(request);
    };

    update = async (request: express.Request): Promise<HealthReportSettingDomainModel> => {
        await this.validateUpdateBody(request);
        return this.getUpdateDomainModel(request);
    };

    // search = async (request: express.Request): Promise<PatientSearchFilters> => {

    //     await this.validateString(request, 'phone', Where.Query, false, false);
    //     await this.validateEmail(request, 'email', Where.Query, false, true);
    //     await this.validateString(request, 'name', Where.Query, false, false);
    //     await this.validateString(request, 'gender', Where.Query, false, false);
    //     await this.validateString(request, 'donorAcceptance', Where.Query, false, false);
    //     await this.validateDateString(request, 'birthdateFrom', Where.Query, false, false);
    //     await this.validateDateString(request, 'birthdateTo', Where.Query, false, false);
    //     await this.validateUuid(request, 'birthdateTo', Where.Query, false, false);
    //     await this.validateString(request, 'userName', Where.Query, false, false);

    //     await this.validateBaseSearchFilters(request);
    //     this.validateRequest(request);

    //     return this.getFilter(request);
    // };

    // private getFilter(request): PatientSearchFilters {

    //     const filters: PatientSearchFilters = {
    //         Phone           : request.query.phone ?? null,
    //         Email           : request.query.email ?? null,
    //         Name            : request.query.name ?? null,
    //         Gender          : request.query.gender ?? null,
    //         DonorAcceptance : request.query.donorAcceptance ?? null,
    //         BirthdateFrom   : request.query.birthdateFrom ?? null,
    //         BirthdateTo     : request.query.birthdateTo ?? null,
    //         UserName        : request.query.userName ?? null,
    //     };

    //     return this.updateBaseSearchFilters(request, filters);
    // }

    // updateByUserId = async (request: express.Request): Promise<PatientDomainModel> => {
    //     await this.validateBody(request, false);
    //     return this.getUpdateDomainModel(request);
    // };

    private async validateBody(request: express.Request, create = true): Promise<void> {

        await this.validateUuid(request, 'PatientUserId', Where.Body, create, false);

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
    }

    private async validateUpdateBody(request: express.Request): Promise<void> {

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
    }

}
