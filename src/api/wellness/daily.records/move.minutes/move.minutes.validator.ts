import express from 'express';
import { MoveMinutesDomainModel } from '../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.domain.model';
import { MoveMinutesSearchFilters } from '../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class MoveMinutesValidator extends BaseValidator{

    getDomainModel = (request: express.Request): MoveMinutesDomainModel => {

        const MoveMinutesModel: MoveMinutesDomainModel = {
            PatientUserId : request.body.PatientUserId,
            MoveMinutes   : request.body.MoveMinutes,
            Unit          : request.body.Unit,
            RecordDate    : request.body.RecordDate ?? null,
        };

        return MoveMinutesModel;
    };

    create = async (request: express.Request): Promise<MoveMinutesDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<MoveMinutesSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateDecimal(request, 'minValue', Where.Query, false, false);
        await this.validateDecimal(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<MoveMinutesDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDecimal(request, 'MoveMinutes', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, true, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'MoveMinutes', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateString(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): MoveMinutesSearchFilters {

        var filters: MoveMinutesSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            MinValue        : request.query.minValue ?? null,
            MaxValue        : request.query.maxValue ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
