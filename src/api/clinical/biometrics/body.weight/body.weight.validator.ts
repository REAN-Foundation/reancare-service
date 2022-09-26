import express from 'express';
import { BodyWeightDomainModel } from '../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { BodyWeightSearchFilters } from '../../../../domain.types/clinical/biometrics/body.weight/body.weight.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyWeightValidator extends BaseValidator{

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): BodyWeightDomainModel => {

        const bodyWeightModel: BodyWeightDomainModel = {
            PatientUserId    : request.body.PatientUserId,
            BodyWeight       : request.body.BodyWeight,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? new Date(),
            RecordedByUserId : request.body.RecordedByUserId ?? request.currentUser.UserId,
        };

        return bodyWeightModel;
    };

    create = async (request: express.Request): Promise<BodyWeightDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<BodyWeightSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateDecimal(request, 'minValue', Where.Query, false, false);
        await this.validateDecimal(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'recordedByUserId', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<BodyWeightDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDecimal(request, 'BodyWeight', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateDecimal(request, 'BodyWeight', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): BodyWeightSearchFilters {

        var filters: BodyWeightSearchFilters = {
            PatientUserId    : request.query.patientUserId ?? null,
            MinValue         : request.query.minValue ?? null,
            MaxValue         : request.query.maxValue ?? null,
            CreatedDateFrom  : request.query.createdDateFrom ?? null,
            CreatedDateTo    : request.query.createdDateTo ?? null,
            RecordedByUserId : request.query.recordedByUserId ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
