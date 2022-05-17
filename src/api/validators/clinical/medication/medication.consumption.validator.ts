import express from 'express';
import { BaseValidator, Where } from '../../../../../src/api/validators/base.validator';
import { MedicationConsumptionScheduleDomainModel, MedicationConsumptionSummaryDomainModel } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';
import { MedicationConsumptionSearchFilters } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types';
import { UserService } from '../../../../services/user/user.service';
import { Loader } from '../../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionValidator extends BaseValidator{

    constructor() {
        super();
    }
    
    checkConsumptionIds = async (request: express.Request): Promise<string[]> => {

        await this.validateUuid(request, 'MedicationConsumptionIds', Where.Body, true, false);

        this.validateRequest(request);

        return request.body.MedicationConsumptionIds;
    };
    
    getParam = async(request: express.Request, paramName) => {

        await this.validateUuid(request, 'paramName', Where.Body, true, false);
        
        this.validateRequest(request);
        return request.params[paramName];
    }

    getPatientUserId = async(request) => {

        await this.validateUuid(request, 'patientUserId', Where.Body, true, false);

        this.validateRequest(request);
        return request.params.patientUserId;
    }

    getScheduleForDuration =  async (request: express.Request): Promise<MedicationConsumptionScheduleDomainModel> => {

        const model: MedicationConsumptionScheduleDomainModel = {
            PatientUserId : request.params.patientUserId,
            Duration      : request.params.duration as string   ?? null,
            When          : request.params.when as string ?? null,
        };

        return model;
    };

    getScheduleForDay = async (request: express.Request): Promise<MedicationConsumptionScheduleDomainModel> => {
        
        var userService = Loader.container.resolve(UserService);
        var date = await userService.getDateInUserTimeZone(request.params.patientUserId, request.query.date as string);

        const model: MedicationConsumptionScheduleDomainModel = {
            PatientUserId : request.params.patientUserId,
            Date          : date,
        };

        return model;
    };

    getSummaryForDay = async (request: express.Request): Promise<MedicationConsumptionSummaryDomainModel> => {
        
        var userService = Loader.container.resolve(UserService);
        var date = await userService.getDateInUserTimeZone(request.params.patientUserId, request.query.date as string);

        const model: MedicationConsumptionSummaryDomainModel = {
            PatientUserId : request.params.patientUserId,
            Date          : date,
        };

        return model;
    };

    getSummaryByCalendarMonths = (request: express.Request): MedicationConsumptionSummaryDomainModel => {

        const model: MedicationConsumptionSummaryDomainModel = {
            PatientUserId     : request.params.patientUserId,
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
            DateFrom      : request.query.dateFrom ?? null,
            DateTo        : request.query.dateTo ?? null,
            OrderBy       : request.query.orderBy ?? 'TimeScheduleStart',
            Order         : request.query.order ?? 'ascending',
            PageIndex     : pageIndex,
            ItemsPerPage  : itemsPerPage,
        };
        return filters;
    }

    searchForPatient = async (request: express.Request): Promise<MedicationConsumptionSearchFilters> => {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'orderId', Where.Body, true, false);
        await this.validateString(request, 'medicationId', Where.Body, false, false);
        await this.validateDate(request, 'fromDate', Where.Body, false, false);
        await this.validateDate(request, 'toDate', Where.Body, false, false);

        this.validateRequest(request);

        return MedicationConsumptionValidator.getFilter(request);
    };

}
