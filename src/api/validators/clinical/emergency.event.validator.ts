import express from 'express';
import { BaseValidator, Where } from '../../../../src/api/validators/base.validator';
import { EmergencyEventDomainModel } from '../../../domain.types/clinical/emergency.event/emergency.event.domain.model';
import { EmergencyEventSearchFilters } from '../../../domain.types/clinical/emergency.event/emergency.event.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyEventValidator extends BaseValidator{
    
    //static getParamId: any;

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): EmergencyEventDomainModel => {

        const emergencyEventModel: EmergencyEventDomainModel = {
            EhrId         : request.body.EhrId ?? undefined,
            PatientUserId : request.body.PatientUserId ?? undefined,
            Details       : request.body.Details ?? "",
            EmergencyDate : request.body.EmergencyDate
        };

        return emergencyEventModel;
    };

    create = async (request: express.Request): Promise<EmergencyEventDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    private async validateCreateBody(request) {

        await this.validateString(request, 'EhrId', Where.Body, false, true);
        await this.validateString(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Details', Where.Body, false, false);
        await this.validateDate(request, 'EmergencyDate', Where.Body, false, true);

        this.validateRequest(request);

    }

    getById = async (request: express.Request): Promise<string> => {
        return await this.getParamUuid(request, 'id');
    };

    delete = async (request: express.Request): Promise<string> => {
        return await this.getParamUuid(request, 'id');
    };
    
    search = async (request: express.Request): Promise<EmergencyEventSearchFilters> => {

        await this.validateString(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateDate(request, 'EmergencyDateFrom', Where.Body, false, false);
        await this.validateDate(request, 'EmergencyDateTo', Where.Body, false, false);
        // await this.validateString(request, 'orderBy', Where.Body, true, false);
        // await this.validateString(request, 'order', Where.Body, true, false);
        // await this.validateInt(request, 'pageIndex', Where.Body, true, false);
        // await this.validateInt(request, 'itemsPerPage', Where.Body, true, false);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<EmergencyEventDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateUpdateBody(request) {

        await this.validateString(request, 'EhrId', Where.Body, true, false);
        await this.validateString(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Details', Where.Body, false, false);
        await this.validateDate(request, 'EmergencyDate', Where.Body, true, false);

        this.validateRequest(request);

    }

    private getFilter(request): EmergencyEventSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: EmergencyEventSearchFilters = {
            PatientUserId             : request.query.PatientUserId ?? null,
            MedicalPractitionerUserId : request.query.MedicalPractitionerUserId ?? null,
            EmergencyDateFrom         : request.query.EmergencyDateFrom ?? null,
            EmergencyDateTo           : request.query.EmergencyDateTo ?? null,
            OrderBy                   : request.query.orderBy ?? 'CreatedAt',
            Order                     : request.query.order ?? 'descending',
            PageIndex                 : pageIndex,
            ItemsPerPage              : itemsPerPage,
        };
        return filters;
    }

}
