import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { MedicationConsumptionSearchFilters } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types';
import { Helper } from '../../../../common/helper';
import { MedicationConsumptionScheduleDomainModel, MedicationConsumptionSummaryDomainModel } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionValidator {

    static checkConsumptionIds = async (request: express.Request): Promise<string[]> => {

        await body('MedicationConsumptionIds').exists()
            .isArray()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.body.MedicationConsumptionIds;
    };
    
    static async getParam(request: express.Request, paramName) {

        await param(paramName).trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params[paramName];
    }

    static async getPatientUserId(request) {

        await param('patientUserId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.patientUserId;
    }

    static getScheduleForDuration = (request: express.Request): MedicationConsumptionScheduleDomainModel => {

        const model: MedicationConsumptionScheduleDomainModel = {
            PatientUserId : request.params.PatientUserId,
            Duration      : request.query.duration as string ?? null,
            When          : request.query.when as string ?? null,
        };

        return model;
    };

    static getScheduleForDay = (request: express.Request): MedicationConsumptionScheduleDomainModel => {

        const model: MedicationConsumptionScheduleDomainModel = {
            PatientUserId : request.params.PatientUserId,
            Date          : request.query.date ? new Date(request.query.date as string) : new Date(),
            GroupByDrug   : request.query.groupByDrug && request.query.groupByDrug === 'true' ? true : false
        };

        return model;
    };

    static getSummaryForDay = (request: express.Request): MedicationConsumptionSummaryDomainModel => {

        const model: MedicationConsumptionSummaryDomainModel = {
            PatientUserId : request.params.PatientUserId,
            Date          : request.query.date ? new Date(request.query.date as string) : new Date(),
        };

        return model;
    };

    static getSummaryByCalendarMonths = (request: express.Request): MedicationConsumptionSummaryDomainModel => {

        const model: MedicationConsumptionSummaryDomainModel = {
            PatientUserId     : request.params.PatientUserId,
            PastMonthsCount   : request.query.pastMonthsCount ? parseInt(request.query.pastMonthsCount as string) : 6,
            FutureMonthsCount : 0
        };

        return model;
    };

    private static getFilter(request): MedicationConsumptionSearchFilters {
        
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: MedicationConsumptionSearchFilters = {
            PatientUserId : request.params.patientUserId ?? null,
            OrderId       : request.query.orderId ?? null,
            MedicationId  : request.query.medicationId ?? null,
            DateFrom      : request.query.startDateFrom ?? null,
            DateTo        : request.query.startDateTo ?? null,
            OrderBy       : request.query.orderBy ?? 'MedicationId',
            Order         : request.query.order ?? 'descending',
            PageIndex     : pageIndex,
            ItemsPerPage  : itemsPerPage,
        };
        return filters;
    }

    static searchForPatient = async (request: express.Request): Promise<MedicationConsumptionSearchFilters> => {

        await param('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('orderId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('medicationId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('fromDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await query('toDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return MedicationConsumptionValidator.getFilter(request);
    };

}
