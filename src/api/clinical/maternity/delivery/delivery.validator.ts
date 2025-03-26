import express from 'express';
import { DeliveryDomainModel } from '../../../../domain.types/clinical/maternity/delivery/delivery.domain.model';
import { DeliverySearchFilters } from '../../../../domain.types/clinical/maternity/delivery/delivery.search.type';
import { DeliveryMode, DeliveryOutcome } from '../../../../domain.types/clinical/maternity/delivery/delivery.type';
import { BaseValidator, Where } from '../../../base.validator';
import { time } from 'console';

///////////////////////////////////////////////////////////////////////////////////////

export class DeliveryValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): DeliveryDomainModel => {

        const DeliveryModel: DeliveryDomainModel = {
            PregnancyId     : request.body.PregnancyId ?? null,
            PatientUserId   : request.body.PatientUserId ?? null,
            DeliveryDate    : request.body.DeliveryDate ?? new Date,
            DeliveryTime    : request.body.DeliveryTime ?? new Date().toTimeString(),
            GestationAtBirth: request.body.GestationAtBirth ?? null,
            DeliveryMode    : request.body.DeliveryMode?? null,
            DeliveryPlace   : request.body.DeliveryPlace?? null,
            DeliveryOutcome : request.body.DeliveryOutcome ?? null,
            DateOfDischarge : request.body.DateOfDischarge ?? null,
            OverallDiagnosis: request.body.OverallDiagnosis ?? null
        };

        return DeliveryModel;
    };

    create = async (request: express.Request): Promise<DeliveryDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<DeliverySearchFilters> => {

        await this.validateDate(request, 'DeliveryDate', Where.Query, false, false);
        // await this.validateTime(request, 'DeliveryTime', Where.Query, false, false);
        await this.validateInt(request, 'GestationAtBirth', Where.Query, false, false);
        await this.validateString(request, 'DeliveryMode', Where.Body, false, false);
        await this.validateString(request, 'DeliveryOutcome', Where.Body, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return DeliveryValidator.getFilter(request);

    };

    update = async (request: express.Request): Promise<DeliveryDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request: express.Request) {

        await this.validateUuid(request, 'PregnancyId', Where.Body, true, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDate(request, 'DeliveryDate', Where.Body, true, false);
        // await this.validateTime(request, 'DeliveryTime', Where.Body, true, false);
        await this.validateInt(request, 'GestationAtBirth', Where.Body, true, false);
        await this.validateString(request, 'DeliveryMode', Where.Body, true, false);
        await this.validateString(request, 'DeliveryOutcome', Where.Body, true, false);

        this.validateRequest(request);
    }
    private async validateUpdateBody(request: express.Request) {

        await this.validateUuid(request, 'PregnancyId', Where.Body, false, false);
        await this.validateDate(request, 'DeliveryDate', Where.Body, false, false);
        // await this.validateTime(request, 'DeliveryTime', Where.Body, false, false);
        await this.validateInt(request, 'GestationAtBirth', Where.Body, false, false);
        await this.validateString(request, 'DeliveryMode', Where.Body, false, false);
        await this.validateString(request, 'DeliveryOutcome', Where.Body, false, false);

        this.validateRequest(request);
    }

    private static getFilter(request): DeliverySearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: DeliverySearchFilters = { 
            DeliveryDate    : request.query.DeliveryDate ?? null,
            DeliveryTime    : request.query.DeliveryTime ?? null,
            GestationAtBirth: request.query.GestationAtBirth ? parseInt(request.query.GestationAtBirth as string) : null,
            DeliveryMode    : request.query.DeliveryMode ?? null,
            DeliveryOutcome : request.query.DeliveryOutcome ?? null,
        };

        return filters;
    }

}
