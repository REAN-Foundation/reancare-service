import express from 'express';
import { EnrollmentDomainModel } from '../../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class EnrollmentValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): EnrollmentDomainModel => {

        const enrollmentDomainModel: EnrollmentDomainModel = {
            UserId        : request.body.UserId,
            Provider      : request.body.Provider,
            EnrollmentId  : request.body.EnrollmentId,
            ParticipantId : request.body.ParticipantId,
            PlanName      : request.body.PlanName,
            PlanCode      : request.body.PlanCode,
            StartDate     : request.body.StartDate,
            EndDate       : request.body.EndDate,
            Gender        : request.body.Gender,
        };

        return enrollmentDomainModel;
    };

    create = async (request: express.Request): Promise<EnrollmentDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'UserId', Where.Body, false, false);
        await this.validateString(request, 'PlanCode', Where.Body, true, false);
        await this.validateString(request, 'Provider', Where.Body, true, false);
        await this.validateString(request, 'PlanName', Where.Body, true, false);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, true, false);
        await this.validateString(request, 'Gender', Where.Body, true, false);

        this.validateRequest(request);

    }

}
