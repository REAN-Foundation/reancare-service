import express from 'express';
import { PregnancyDomainModel } from '../../../../domain.types/clinical/maternity/pregnancy/pregnancy.domain.model';
import { PregnancySearchFilters } from '../../../../domain.types/clinical/maternity/pregnancy/pregnancy.search.type';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PregnancyValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): PregnancyDomainModel => {

        const PregnancyModel: PregnancyDomainModel = {
            PatientUserId             : request.body.PatientUserId,
            ExternalPregnancyId       : request.body.ExternalPregnancyId,
            DateOfLastMenstrualPeriod : request.body.DateOfLastMenstrualPeriod,
            EstimatedDateOfChildBirth : request.body.EstimatedDateOfChildBirth,
            Gravidity                 : request.body.Gravidity,
            Parity                    : request.body.Parity,
        };

        return PregnancyModel;
    };

    create = async (request: express.Request): Promise<PregnancyDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<PregnancySearchFilters> => {

        await this.validateDate(request, 'DateOfLastMenstrualPeriod', Where.Query, false, false);
        await this.validateDate(request, 'EstimatedDateOfChildBirth', Where.Query, false, false);
        await this.validateInt(request, 'Gravidity', Where.Query, false, false);
        await this.validateInt(request, 'Parity', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return PregnancyValidator.getFilter(request);

    };

    update = async (request: express.Request): Promise<PregnancyDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request: express.Request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'ExternalPregnancyId', Where.Body, true, false);
        await this.validateDate(request, 'DateOfLastMenstrualPeriod', Where.Body, true, false);
        await this.validateDate(request, 'EstimatedDateOfChildBirth', Where.Body, true, false);
        await this.validateInt(request, 'Gravidity', Where.Body, true, false);
        await this.validateInt(request, 'Parity', Where.Body, true, false);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request: express.Request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateDate(request, 'DateOfLastMenstrualPeriod', Where.Body, false, false);
        await this.validateDate(request, 'EstimatedDateOfChildBirth', Where.Body, false, false);
        await this.validateInt(request, 'Gravidity', Where.Body, false, false);
        await this.validateInt(request, 'Parity', Where.Body, false, false);

        this.validateRequest(request);
    }

    private static getFilter(request): PregnancySearchFilters {
   
           const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
   
           const itemsPerPage = request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

           const filters: PregnancySearchFilters = { 
            DateOfLastMenstrualPeriod : request.query.DateOfLastMenstrualPeriod ?? null,
            EstimatedDateOfChildBirth   : request.query.EstimatedDateOfChildBirth ?? null,
            Gravidity                     : request.query.Gravidity ? parseInt(request.query.Gravidity as string) : null,
            Parity                        : request.query.Parity ? parseInt(request.query.Parity as string) : null,
        };

        return filters;
    }

}
