import express from 'express';
import { HowDoYouFeelDomainModel } from '../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { HowDoYouFeelSearchFilters } from '../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class HowDoYouFeelValidator extends BaseValidator{

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): HowDoYouFeelDomainModel => {

        const howDoYouFeelModel: HowDoYouFeelDomainModel = {
            PatientUserId : request.body.PatientUserId ?? null,
            Feeling       : request.body.Feeling ?? null,
            Comments      : request.body.Comments ?? null,
            RecordDate    : request.body.RecordDate ?? new Date()
        };

        return howDoYouFeelModel;
    };

    create = async (request: express.Request): Promise<HowDoYouFeelDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<HowDoYouFeelSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'feeling', Where.Query, false, false);
        await this.validateDate(request, 'dateFrom', Where.Query, false, false);
        await this.validateDate(request, 'dateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<HowDoYouFeelDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'Feeling', Where.Body, true, false);
        await this.validateString(request, 'Comments', Where.Body, true, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateInt(request, 'Feeling', Where.Body, false, false);
        await this.validateString(request, 'Comments', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): HowDoYouFeelSearchFilters {

        var filters: HowDoYouFeelSearchFilters = {
            PatientUserId : request.query.patientUserId ?? null,
            Feeling       : request.query.feeling ?? null,
            DateFrom      : request.query.dateFrom ?? null,
            DateTo        : request.query.dateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
