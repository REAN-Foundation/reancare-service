import express from 'express';
import { PulseDomainModel } from '../../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';
import { PulseSearchFilters } from '../../../../domain.types/clinical/biometrics/pulse/pulse.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PulseValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): PulseDomainModel => {

        const PulseModel: PulseDomainModel = {
            PatientUserId    : request.body.PatientUserId,
            Pulse            : request.body.Pulse,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? new Date(),
            RecordedByUserId : request.body.RecordedByUserId ?? request.currentUser.UserId,
        };

        return PulseModel;
    };

    create = async (request: express.Request): Promise<PulseDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<PulseSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'minValue', Where.Query, false, false);
        await this.validateInt(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'recordedByUserId', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<PulseDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'Pulse', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateInt(request, 'Pulse', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private getFilter(request): PulseSearchFilters {

        var filters: PulseSearchFilters = {
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
