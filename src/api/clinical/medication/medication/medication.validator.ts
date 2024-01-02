import express from 'express';
import { body, oneOf, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { MedicationDomainModel } from '../../../../domain.types/clinical/medication/medication/medication.domain.model';
import { MedicationSearchFilters } from '../../../../domain.types/clinical/medication/medication/medication.search.types';
import {
    MedicationAdministrationRoutes, MedicationFrequencyUnits
} from "../../../../domain.types/clinical/medication/medication/medication.types";
import { UserService } from '../../../../services/users/user/user.service';
import { Loader } from '../../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationValidator {

    static getCreateDomainModel = async (request: express.Request): Promise<MedicationDomainModel> => {

        var userService = Loader.container.resolve(UserService);
        var startDate = await userService.getDateInUserTimeZone(request.body.PatientUserId, request.body.StartDate);

        const model: MedicationDomainModel = {
            PatientUserId             : request.body.PatientUserId,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId ?? null,
            OrderId                   : request.body.OrderId ?? null,
            DrugName                  : request.body.DrugName ?? null,
            DrugId                    : request.body.DrugId,
            Dose                      : request.body.Dose ? request.body.Dose.toString() : null,
            DosageUnit                : request.body.DosageUnit,
            TimeSchedules             : request.body.TimeSchedules ? request.body.TimeSchedules : [],
            Frequency                 : request.body.Frequency ? parseInt(request.body.Frequency) : 1,
            FrequencyUnit             : request.body.FrequencyUnit ?? MedicationFrequencyUnits.Daily,
            Route                     : request.body.Route ?? MedicationAdministrationRoutes.Oral,
            Duration                  : request.body.Duration ? parseInt(request.body.Duration) : null,
            DurationUnit              : request.body.DurationUnit ?? null,
            StartDate                 : startDate,
            EndDate                   : request.body.EndDate ?? null,
            RefillNeeded              : request.body.RefillNeeded ?? false,
            RefillCount               : request.body.RefillCount ?? 0,
            Instructions              : request.body.Instructions ?? null,
            ImageResourceId           : request.body.ImageResourceId ?? null,
            IsExistingMedication      : request.body.IsExistingMedication ?? false,
            TakenForLastNDays         : request.body.TakenForLastNDays ?? 0,
            ToBeTakenForNextNDays     : request.body.ToBeTakenForNextNDays ?? 0,
            IsCancelled               : request.body.IsCancelled ?? false,
        };

        return model;
    };

    static getUpdateDomainModel = async (request: express.Request): Promise<MedicationDomainModel> => {

        const model: MedicationDomainModel = {
            id                        : request.params.id,
            PatientUserId             : request.body.PatientUserId ?? null,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId ?? null,
            OrderId                   : request.body.OrderId ?? null,
            DrugName                  : request.body.DrugName ?? null,
            DrugId                    : request.body.DrugId ?? null,
            Dose                      : request.body.Dose ? request.body.Dose.toString() : null,
            DosageUnit                : request.body.DosageUnit ?? null,
            TimeSchedules             : request.body.TimeSchedules ?? [],
            Frequency                 : request.body.Frequency ? parseInt(request.body.Frequency) : null,
            FrequencyUnit             : request.body.FrequencyUnit ?? null,
            Route                     : request.body.Route ?? null,
            Duration                  : request.body.Duration ? parseInt(request.body.Duration) : null,
            DurationUnit              : request.body.DurationUnit ?? null,
            StartDate                 : request.body.StartDate,
            EndDate                   : request.body.EndDate ?? null,
            RefillNeeded              : request.body.RefillNeeded ?? null,
            RefillCount               : request.body.RefillCount ?? null,
            Instructions              : request.body.Instructions ?? null,
            ImageResourceId           : request.body.ImageResourceId ?? null,
            IsExistingMedication      : request.body.IsExistingMedication ?? null,
            TakenForLastNDays         : request.body.TakenForLastNDays ?? null,
            ToBeTakenForNextNDays     : request.body.ToBeTakenForNextNDays ?? null,
            IsCancelled               : request.body.IsCancelled ?? null,
        };

        return model;
    };

    static create = async (request: express.Request): Promise<MedicationDomainModel> => {
        await MedicationValidator.validateCreateBody(request);
        return await MedicationValidator.getCreateDomainModel(request);
    };

    static update = async (request: express.Request): Promise<MedicationDomainModel> => {
        const id = await MedicationValidator.getParamId(request);
        await MedicationValidator.validateUpdateBody(request);
        const domainModel = await MedicationValidator.getUpdateDomainModel(request);
        domainModel.id = id;
        return domainModel;
    };

    private static async validateCreateBody(request) {

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

        await body('OrderId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await oneOf([
            body('DrugName').optional()
                .trim(),
            body('DrugId').optional()
                .trim()
                .escape()
                .isUUID()
        ]).run(request);

        await oneOf([
            body('Dose').exists()
                .isDecimal(),
            body('Dose').exists()
                .isString()
        ]).run(request);

        await body('DosageUnit').exists()
            .trim()
            .run(request);

        await body('TimeSchedules').optional()
            .isArray()
            .run(request);

        await body('Frequency').optional()
            .isInt()
            .run(request);

        await body('FrequencyUnit').optional()
            .trim()
            .run(request);

        await body('Route').optional()
            .trim()
            .run(request);

        await body('Duration').optional()
            .isInt()
            .run(request);

        await body('DurationUnit').optional()
            .trim()
            .run(request);

        await body('StartDate').optional()
            .trim()
            .isDate()
            .run(request);

        await body('EndDate').optional()
            .trim()
            .isDate()
            .run(request);

        await body('RefillNeeded').optional()
            .isBoolean()
            .run(request);

        await body('RefillCount').optional()
            .trim()
            .isInt()
            .run(request);

        await body('Instructions').optional()
            .trim()
            .run(request);

        if (
            request.body.ImageResourceId === "" ||
            request.body.ImageResourceId === null ||
            request.body.ImageResourceId === undefined
        ) {
            delete request.body.ImageResourceId;
        }
        await body('ImageResourceId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('IsExistingMedication').optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('TakenForLastNDays').optional()
            .trim()
            .isInt()
            .run(request);

        await body('ToBeTakenForNextNDays').optional()
            .trim()
            .isInt()
            .run(request);

        await body('IsCancelled').optional()
            .trim()
            .isBoolean()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static async validateUpdateBody(request) {

        await param('id').exists()
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

        await body('OrderId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('DrugId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('DrugName').optional()
            .trim()
            .run(request);

        await oneOf([
            body('Dose').optional()
                .isDecimal(),
            body('Dose').optional()
                .isString()
        ]).run(request);

        await body('DosageUnit').optional()
            .trim()
            .run(request);

        await body('TimeSchedules').optional()
            .isArray()
            .run(request);

        await body('Frequency').optional()
            .isInt()
            .run(request);

        await body('FrequencyUnit').optional()
            .trim()
            .run(request);

        await body('Route').optional()
            .trim()
            .run(request);

        await body('Duration').optional()
            .isInt()
            .run(request);

        await body('DurationUnit').optional()
            .trim()
            .run(request);

        await body('StartDate').optional()
            .trim()
            .isDate()
            .run(request);

        await body('EndDate').optional()
            .trim()
            .isDate()
            .run(request);

        await body('RefillNeeded').optional()
            .isBoolean()
            .run(request);

        await body('RefillCount').optional()
            .trim()
            .isInt()
            .run(request);

        await body('Instructions').optional()
            .trim()
            .run(request);

        await body('ImageResourceId').optional()
            .trim()
            .run(request);

        await body('IsExistingMedication').optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('TakenForLastNDays').optional()
            .trim()
            .isInt()
            .run(request);

        await body('ToBeTakenForNextNDays').optional()
            .trim()
            .isInt()
            .run(request);

        await body('IsCancelled').optional()
            .trim()
            .isBoolean()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): MedicationSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: MedicationSearchFilters = {
            DrugName                  : request.query.drugName ?? null,
            PatientUserId             : request.query.patientUserId ?? null,
            MedicalPractitionerUserId : request.query.medicalPractitionerUserId ?? null,
            VisitId                   : request.query.visitId ?? null,
            OrderId                   : request.query.orderId ?? null,
            RefillNeeded              : request.query.refillNeeded ?? null,
            IsExistingMedication      : request.query.isExistingMedication ?? null,
            StartDateFrom             : request.query.startDateFrom ?? null,
            StartDateTo               : request.query.startDateTo ?? null,
            EndDateFrom               : request.query.endDateFrom ?? null,
            EndDateTo                 : request.query.endDateTo ?? null,
            CreatedDateFrom           : request.query.createdDateFrom ?? null,
            CreatedDateTo             : request.query.createdDateTo ?? null,
            OrderBy                   : request.query.orderBy ?? 'CreatedAt',
            Order                     : request.query.order ?? 'descending',
            PageIndex                 : pageIndex,
            ItemsPerPage              : itemsPerPage,
        };
        return filters;
    }

    static search = async (request: express.Request): Promise<MedicationSearchFilters> => {

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

        await query('orderId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('drugName').optional()
            .trim()
            .run(request);

        await query('refillNeeded').optional()
            .trim()
            .isBoolean()
            .run(request);

        await query('isExistingMedication').optional()
            .trim()
            .isBoolean()
            .run(request);

        await query('startDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('startDateTo').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('endDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('endDateTo').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('createdDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('createdDateTo').optional()
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

        return MedicationValidator.getFilter(request);
    };

    static async getParamId(request) {

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

    static async getParamImageId(request) {

        await param('imageId').trim()
            .escape()
            .isInt()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return parseInt(request.params.imageId);
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

}
