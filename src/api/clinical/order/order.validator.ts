import express from 'express';
import { OrderDomainModel } from '../../../domain.types/clinical/order/order.domain.model';
import { OrderSearchFilters } from '../../../domain.types/clinical/order/order.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class OrderValidator extends BaseValidator{

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): OrderDomainModel => {

        const OrderModel: OrderDomainModel = {
            Type                      : request.body.Type,
            DisplayId                 : request.body.DisplayId ?? null,
            PatientUserId             : request.body.PatientUserId,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId ?? null,
            ResourceId                : request.body.ResourceId ?? null,
            ReferenceOrderId          : request.body.ReferenceOrderId ?? null,
            CurrentState              : request.body.CurrentState,
            OrderDate                 : request.body.OrderDate ?? new Date(),
            FulfilledByUserId         : request.body.FulfilledByUserId ?? null,
            FulfilledByOrganizationId : request.body.FulfilledByOrganizationId ?? null,
            AdditionalInformation     : request.body.AdditionalInformation,

        };

        return OrderModel;
    };

    create = async (request: express.Request): Promise<OrderDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<OrderSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'type', Where.Query, false, false);
        await this.validateString(request, 'medicalPractitionerUserId', Where.Query, false, false);
        await this.validateString(request, 'visitId', Where.Query, false, false);
        await this.validateString(request, 'referenceOrderId', Where.Query, false, false);
        await this.validateString(request, 'fulfilledByUserId', Where.Query, false, false);
        await this.validateString(request, 'fulfilledByOrganizationId', Where.Query, false, false);
        await this.validateString(request, 'currentState', Where.Query, false, false);
        await this.validateDate(request, 'orderDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'orderDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<OrderDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateString(request, 'Type', Where.Body, false, true);
        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'DisplayId', Where.Body, true, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, true, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, true);
        await this.validateUuid(request, 'ResourceId', Where.Body, false, true);
        await this.validateUuid(request, 'ReferenceOrderId', Where.Body, false, true);
        await this.validateString(request, 'CurrentState', Where.Body, false, true);
        await this.validateDate(request, 'OrderDate', Where.Body, false, true);
        await this.validateUuid(request, 'FulfilledByUserId', Where.Body, false, false);
        await this.validateUuid(request, 'FulfilledByOrganizationId', Where.Body, false, false);
        await this.validateString(request, 'AdditionalInformation', Where.Body, false, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'Type', Where.Body, false, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'DisplayId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateUuid(request, 'ResourceId', Where.Body, false, false);
        await this.validateUuid(request, 'ReferenceOrderId', Where.Body, false, false);
        await this.validateString(request, 'CurrentState', Where.Body, false, false);
        await this.validateDate(request, 'OrderDate', Where.Body, false, false);
        await this.validateUuid(request, 'FulfilledByUserId', Where.Body, false, false);
        await this.validateUuid(request, 'FulfilledByOrganizationId', Where.Body, false, false);
        await this.validateString(request, 'AdditionalInformation', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): OrderSearchFilters {

        var filters: OrderSearchFilters = {
            PatientUserId             : request.query.patientUserId ?? null,
            Type                      : request.query.type ?? null,
            MedicalPractitionerUserId : request.query.medicalPractitionerUserId ?? null,
            VisitId                   : request.query.visitId ?? null,
            ReferenceOrderId          : request.query.referenceOrderId ?? null,
            FulfilledByUserId         : request.query.fulfilledByUserId ?? null,
            FulfilledByOrganizationId : request.query.fulfilledByOrganizationId ?? null,
            CurrentState              : request.query.currentState ?? null,
            OrderDateFrom             : request.query.orderDateFrom ?? null,
            OrderDateTo               : request.query.orderDateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
