import express from 'express';
import { body, param, validationResult, query } from 'express-validator';

import { Helper } from '../../../common/helper';
import { EmergencyContactDomainModel } from '../../../domain.types/patient/emergency.contact/emergency.contact.domain.model';
import { EmergencyContactSearchFilters } from '../../../domain.types/patient/emergency.contact/emergency.contact.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyContactValidator {

    static getDomainModel = (request: express.Request): EmergencyContactDomainModel => {

        const patientAllergyModel: EmergencyContactDomainModel = {
            PatientUserId           : request.body.PatientUserId ?? null,
            ContactPersonId         : request.body.ContactPersonId ?? null,
            ContactRelation         : request.body.ContactRelation ?? null,
            AddressId               : request.body.AddressId,
            OrganizationId          : request.body.OrganizationId ?? null,
            IsAvailableForEmergency : request.body.IsAvailableForEmergency ?? null,
            TimeOfAvailability      : request.body.TimeOfAvailability ?? null,
            Description             : request.body.Description ?? null,
            AdditionalPhoneNumbers  : request.body.AdditionalPhoneNumbers ?? null
        };

        return patientAllergyModel;
    };

    static create = async (request: express.Request): Promise<EmergencyContactDomainModel> => {
        await EmergencyContactValidator.validateBody(request);
        return EmergencyContactValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await EmergencyContactValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await EmergencyContactValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<EmergencyContactSearchFilters> => {
        await query('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('ContactPersonId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('IsAvailableForEmergency').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('ContactRelation').optional()
            .trim()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return EmergencyContactValidator.getFilter(request);
    };

    private static getFilter(request): EmergencyContactSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: EmergencyContactSearchFilters = {
            PatientUserId           : request.query.PatientUserId ?? null,
            ContactPersonId         : request.query.ContactPersonId ?? null,
            IsAvailableForEmergency : request.query.IsAvailableForEmergency ?? null,
            ContactRelation         : request.query.ContactRelation ?? null,
            OrderBy                 : request.query.orderBy ?? 'IsAvailableForEmergency',
            Order                   : request.query.order ?? 'descending',
            PageIndex               : pageIndex,
            ItemsPerPage            : itemsPerPage,
        };
        return filters;
    }

    static update = async (request: express.Request): Promise<EmergencyContactDomainModel> => {

        const id = await EmergencyContactValidator.getParamId(request);
        await EmergencyContactValidator.validateBody(request);

        const domainModel = EmergencyContactValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('ContactPersonId').exists()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('ContactRelation').optional()
            .trim()
            .escape()
            .run(request);

        await body('AddressId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('OrganizationId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('IsAvailableForEmergency').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await body('TimeOfAvailability').optional()
            .trim()
            .escape()
            .run(request);

        await body('Description').optional()
            .trim()
            .escape()
            .run(request);
    
        await body('AdditionalPhoneNumbers').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
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
