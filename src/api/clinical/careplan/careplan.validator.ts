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
            PatientUserId : request.params.patientUserId,
            Provider      : request.body.Provider,
            PlanName      : request.body.PlanName,
            PlanCode      : request.body.PlanCode,
            StartDateStr  : request.body.StartDate,
            EndDateStr    : request.body.EndDate,
            DayOffset     : request.body.DayOffset,
            WeekOffset    : request.body.WeekOffset,
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

    private async validateCreateBody(request) {
        await this.validateString(request, 'Provider', Where.Body, true, false);
        await this.validateString(request, 'PlanCode', Where.Body, true, false);
        await this.validateString(request, 'PlanName', Where.Body, false, true);
        await this.validateString(request, 'StartDate', Where.Body, false, true);
        await this.validateString(request, 'EndDate', Where.Body, false, false);
        await this.validateInt(request, 'DayOffset', Where.Body, false, false);
        await this.validateInt(request, 'WeekOffset', Where.Body, false, false);
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
