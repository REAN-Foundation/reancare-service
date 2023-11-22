import express from 'express';
import { BloodGlucoseDomainModel } from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseSearchFilters } from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): BloodGlucoseDomainModel => {

        const bloodGlucoseDomainModel: BloodGlucoseDomainModel = {
            PatientUserId    : request.body.PatientUserId,
            BloodGlucose     : request.body.BloodGlucose,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? new Date(),
            RecordedByUserId : request.body.RecordedByUserId ?? request.currentUser.UserId
        };

        return bloodGlucoseDomainModel;
    };

    create = async (request: express.Request): Promise<BloodGlucoseDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<BloodGlucoseSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'recordedByUserId', Where.Query, false, false);
        await this.validateInt(request, 'minValue', Where.Query, false, false);
        await this.validateInt(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<BloodGlucoseDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, false);
        await this.validateInt(request, 'BloodGlucose', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);

    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, false);
        await this.validateInt(request, 'BloodGlucose', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): BloodGlucoseSearchFilters {

        const filters: BloodGlucoseSearchFilters = {
            PatientUserId    : request.query.patientUserId ?? null,
            RecordedByUserId : request.query.recordedByUserId ?? null,
            MinValue         : request.query.minValue ?? null,
            MaxValue         : request.query.maxValue ?? null,
            CreatedDateFrom  : request.query.createdDateFrom ?? null,
            CreatedDateTo    : request.query.createdDateTo ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
