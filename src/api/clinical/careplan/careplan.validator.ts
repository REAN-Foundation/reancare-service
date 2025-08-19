import express from 'express';
import { EnrollmentDomainModel } from '../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class CareplanValidator extends BaseValidator {

    constructor() {
        super();
    }

    getEnrollmentDomainModel = (request: express.Request): EnrollmentDomainModel => {

        const model: EnrollmentDomainModel = {
            PatientUserId  : request.params.patientUserId,
            Provider       : request.body.Provider,
            PlanName       : request.body.PlanName,
            PlanCode       : request.body.PlanCode,
            StartDateStr   : request.body.StartDate,
            EndDateStr     : request.body.EndDate,
            DayOffset      : request.body.DayOffset,
            WeekOffset     : request.body.WeekOffset,
            Channel        : request.body.Channel,
            TenantName     : request.body.TenantName,
            IsTest         : request.body.IsTest ?? false,
            ScheduleConfig : request.body.ScheduleConfig ? {
                NumberOfDays      : request.body.ScheduleConfig.NumberOfDays ?? 1,
                StartHour         : request.body.ScheduleConfig.StartHour ?? 9,
                StartMinutes      : request.body.ScheduleConfig.StartMinutes ?? 0,
                IntervalMinutes   : request.body.ScheduleConfig.IntervalMinutes ?? 0,
                StartFromTomorrow : request.body.ScheduleConfig.StartFromTomorrow ?? false,
                Timezone          : request.body.ScheduleConfig.Timezone ?? '+05:30'
            } : undefined,
        };

        return model;
    };

    updateRiskDomainModel = (request: express.Request): EnrollmentDomainModel => {

        const model: EnrollmentDomainModel = {
            Phone        : request.body.Phone,
            Provider     : request.body.Provider,
            PlanName     : request.body.PlanName,
            PlanCode     : request.body.PlanCode,
            Complication : request.body.Complication,
            HasHighRisk  : request.body.HasHighRisk
        };

        return model;
    };

    enroll = async (request: express.Request): Promise<EnrollmentDomainModel> => {

        await this.validateUuid(request, 'patientUserId', Where.Param, true, false);
        await this.validateCreateBody(request);

        return this.getEnrollmentDomainModel(request);
    };

    updateRisk = async (request: express.Request): Promise<EnrollmentDomainModel> => {
        await this.validateUpdateRiskBody(request);
        return this.updateRiskDomainModel(request);
    };

    stop = async (request: express.Request) => {
        await this.validateUuid(request, 'id', Where.Param, true, false);
    };

    private async validateCreateBody(request) {
        await this.validateString(request, 'Provider', Where.Body, true, false);
        await this.validateString(request, 'PlanCode', Where.Body, true, false);
        await this.validateString(request, 'PlanName', Where.Body, false, true);
        await this.validateString(request, 'StartDate', Where.Body, false, true);
        await this.validateString(request, 'EndDate', Where.Body, false, false);
        await this.validateInt(request, 'DayOffset', Where.Body, false, false);
        await this.validateInt(request, 'WeekOffset', Where.Body, false, false);
        await this.validateString(request, 'TenantName', Where.Body, false, false);
        await this.validateString(request, 'Channel', Where.Body, false, false);
        await this.validateBoolean(request, 'IsTest', Where.Body, false, false);
        if (request.body.ScheduleConfig) {
            await this.validateInt(request, 'ScheduleConfig.NumberOfDays', Where.Body, false, false);
            await this.validateInt(request, 'ScheduleConfig.StartHour', Where.Body, false, false);
            await this.validateInt(request, 'ScheduleConfig.StartMinutes', Where.Body, false, false);
            await this.validateInt(request, 'ScheduleConfig.IntervalMinutes', Where.Body, false, false);
            await this.validateBoolean(request, 'ScheduleConfig.StartFromTomorrow', Where.Body, false, false);
            await this.validateString(request, 'ScheduleConfig.Timezone', Where.Body, false, false);
        }
        
        this.validateRequest(request);
    }

    private async validateUpdateRiskBody(request) {

        await this.validateString(request, 'Provider', Where.Body, false, false);
        await this.validateString(request, 'Phone', Where.Body, true, false);
        await this.validateString(request, 'PlanName', Where.Body, false, true);
        await this.validateString(request, 'PlanCode', Where.Body, false, true);
        await this.validateString(request, 'Complication', Where.Body, false, true);
        await this.validateBoolean(request, 'HasHighRisk', Where.Body, true, false);

        this.validateRequest(request);
    }

}
