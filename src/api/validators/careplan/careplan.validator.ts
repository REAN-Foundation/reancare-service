import express from 'express';
import { EnrollmentDomainModel } from '../../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class CareplanValidator extends BaseValidator {

    constructor() {
        super();
    }

    getEnrollmentDomainModel = (request: express.Request): EnrollmentDomainModel => {

        const enrollmentDomainModel: EnrollmentDomainModel = {
            UserId        : request.body.UserId,
            Provider      : request.body.Provider,
            EnrollmentId  : request.body.EnrollmentId,
            ParticipantId : request.body.ParticipantId,
            PlanName      : request.body.PlanName,
            PlanCode      : request.body.PlanCode,
            StartDateStr  : request.body.StartDate,
            EndDateStr    : request.body.EndDate,
            Gender        : request.body.Gender,
        };

        return enrollmentDomainModel;
    };

    enrollPatient = async (request: express.Request): Promise<EnrollmentDomainModel> => {
        await this.validateCreateBody(request);
        return this.getEnrollmentDomainModel(request);
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'UserId', Where.Body, false, false);
        await this.validateString(request, 'PlanCode', Where.Body, true, false);
        await this.validateString(request, 'Provider', Where.Body, true, false);
        await this.validateString(request, 'PlanName', Where.Body, true, false);
        await this.validateString(request, 'StartDate', Where.Body, false, true);
        await this.validateString(request, 'EndDate', Where.Body, true, false);
        await this.validateString(request, 'Gender', Where.Body, true, false);

        this.validateRequest(request);

    }

}
