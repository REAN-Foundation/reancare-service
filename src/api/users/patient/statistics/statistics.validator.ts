import express from 'express';
import { Injector } from '../../../../startup/injector';
import { UserService } from '../../../../services/users/user/user.service';
import { BaseValidator, Where } from '../../../base.validator';
import { HealthReportSettingsDomainModel, ReportFrequency } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { InputValidationError } from '../../../../common/input.validation.error';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsValidator  extends BaseValidator {

    _userService: UserService = null;

    constructor() {
        super();
        this._userService = Injector.Container.resolve(UserService);
    }

    getCreateDomainModel = async (request: express.Request): Promise<HealthReportSettingsDomainModel> => {
        
        const entity: HealthReportSettingsDomainModel = {
            PatientUserId : request.params.patientUserId,
            Preference    : {
                ReportFrequency             : request.body.ReportFrequency,
                HealthJourney               : request.body.HealthJourney,
                MedicationAdherence         : request.body.MedicationAdherence,
                BodyWeight                  : request.body.BodyWeight,
                BloodGlucose                : request.body.BloodGlucose,
                BloodPressure               : request.body.BloodPressure,
                SleepHistory                : request.body.SleepHistory,
                LabValues                   : request.body.LabValues,
                ExerciseAndPhysicalActivity : request.body.ExerciseAndPhysicalActivity,
                FoodAndNutrition            : request.body.FoodAndNutrition,
                DailyTaskStatus             : request.body.DailyTaskStatus,
            }
            
        };
        return entity;
    };

    getUpdateDomainModel = async (request: express.Request): Promise<HealthReportSettingsDomainModel> => {
        const entity: HealthReportSettingsDomainModel = {
            Preference : request.body
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

        await this.validateString(request, 'ReportFrequency', Where.Body, create, false);
        await this.validateBoolean(request, 'HealthJourney', Where.Body, true, false);
        await this.validateBoolean(request, 'MedicationAdherence', Where.Body, true, false);
        await this.validateBoolean(request, 'BodyWeight', Where.Body, true, false);
        await this.validateBoolean(request, 'BloodGlucose', Where.Body, true, false);
        await this.validateBoolean(request, 'BloodPressure', Where.Body, true, false);
        await this.validateBoolean(request, 'SleepHistory', Where.Body, true, false);
        await this.validateBoolean(request, 'LabValues', Where.Body, true, false);
        await this.validateBoolean(request, 'ExerciseAndPhysicalActivity', Where.Body, true, false);
        await this.validateBoolean(request, 'FoodAndNutrition', Where.Body, true, false);
        await this.validateBoolean(request, 'DailyTaskStatus', Where.Body, true, false);
        
        this.validateRequest(request);
        if (!Object.values(ReportFrequency).includes(request.body.ReportFrequency)) {
            throw new InputValidationError(['Invalid value for report frequency']);
        }
    }

    private async validateUpdateBody(request: express.Request): Promise<void> {
        await this.validateString(request, 'ReportFrequency', Where.Body, true, false);
        await this.validateBoolean(request, 'HealthJourney', Where.Body, true, false);
        await this.validateBoolean(request, 'MedicationAdherence', Where.Body, true, false);
        await this.validateBoolean(request, 'BodyWeight', Where.Body, true, false);
        await this.validateBoolean(request, 'BloodGlucose', Where.Body, true, false);
        await this.validateBoolean(request, 'BloodPressure', Where.Body, true, false);
        await this.validateBoolean(request, 'SleepHistory', Where.Body, true, false);
        await this.validateBoolean(request, 'LabValues', Where.Body, true, false);
        await this.validateBoolean(request, 'ExerciseAndPhysicalActivity', Where.Body, true, false);
        await this.validateBoolean(request, 'FoodAndNutrition', Where.Body, true, false);
        await this.validateBoolean(request, 'DailyTaskStatus', Where.Body, true, false);
        
        this.validateRequest(request);

        if (!Object.values(ReportFrequency).includes(request.body.ReportFrequency)) {
            throw new InputValidationError(['Invalid value for report frequency']);
        }
    }

}
