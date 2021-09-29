import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../common/helper';
import { OrderDomainModel } from '../../../domain.types/order/order.domain.model';
import { OrderSearchFilters } from '../../../domain.types/order/order.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class OrderValidator {

    static getDomainModel = (request: express.Request): OrderDomainModel => {

        const OrderModel: OrderDomainModel = {
            Type                      : request.body.Type,
            DisplayId                 : request.body.DisplayId ?? null,
            PatientUserId             : request.body.PatientUserId,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId,
            VisitId                   : request.body.VisitId ?? null,
            ResourceId                : request.body.ResourceId ?? null,
            ReferenceOrderId          : request.body.ReferenceOrderId ?? null,
            CurrentState              : request.body.CurrentState,
            OrderDate                 : request.body.OrderDate ?? null,
            FulfilledByUserId         : request.body.FulfilledByUserId ?? null,
            FulfilledByOrganizationId : request.body.FulfilledByOrganizationId ?? null,
            AdditionalInformation     : request.body.AdditionalInformation ?? null,

        };

        return OrderModel;
    };

    static create = async (request: express.Request): Promise<OrderDomainModel> => {
        await OrderValidator.validateBody(request);
        return OrderValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await OrderValidator.getParamId(request);
    };

    static getByPatientUserId = async (request: express.Request): Promise<string> => {

        await param('PatientUserId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.params.patientUserId;
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await OrderValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<OrderSearchFilters> => {

        await query('type').optional()
            .trim()
            .escape()
            .run(request);

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('medicalPractitionerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('visitId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('referenceOrderId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('fulfilledByUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('fulfilledByOrganizationId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('currentState').optional()
            .trim()
            .escape()
            .run(request);

        await query('orderDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('orderDateTo').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        await query('itemsPerPage').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return OrderValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<OrderDomainModel> => {

        const id = await OrderValidator.getParamId(request);
        await OrderValidator.validateBody(request);

        const domainModel = OrderValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('Type').optional()
            .trim()
            .escape()
            .run(request);

        await body('DisplayId').optional()
            .trim()
            .escape()
            .run(request);

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('MedicalPractitionerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('VisitId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('ResourceId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('ReferenceOrderId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('CurrentState').optional()
            .trim()
            .escape()
            .run(request);

        await body('FulfilledByUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('FulfilledByOrganizationId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('AdditionalInformation').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): OrderSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: OrderSearchFilters = {
            Type : request.query.type,

            PatientUserId             : request.query.patientUserId ,
            MedicalPractitionerUserId : request.query.medicalPractitionerUserId ?? null,
            VisitId                   : request.query.visitId ?? null,
            ReferenceOrderId          : request.query.referenceOrderId ?? null,
            FulfilledByUserId         : request.query.fulfilledByUserId ?? null,
            FulfilledByOrganizationId : request.query.fulfilledByOrganizationId ?? null,
            CurrentState              : request.query.currentState ?? null,
            OrderDateFrom             : request.query.orderDateFrom,
            OrderDateTo               : request.query.rderDateTo ?? null,
            OrderBy                   : request.query.orderBy ?? 'CreatedAt',
            Order                     : request.query.order ?? 'descending',
            PageIndex                 : pageIndex,
            ItemsPerPage              : itemsPerPage,
        };
        return filters;
    }

    private static async getParamId(request) {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    }

}
