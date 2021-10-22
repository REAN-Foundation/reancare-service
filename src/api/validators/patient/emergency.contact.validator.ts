import express from 'express';
import { body, oneOf, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { AddressDomainModel } from '../../../domain.types/address/address.domain.model';
import { EmergencyContactDomainModel } from '../../../domain.types/patient/emergency.contact/emergency.contact.domain.model';
import { EmergencyContactSearchFilters } from '../../../domain.types/patient/emergency.contact/emergency.contact.search.types';
import { PersonDomainModel } from '../../../domain.types/person/person.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyContactValidator {

    static getCreateDomainModel = (request: express.Request): EmergencyContactDomainModel => {

        var contactPerson: PersonDomainModel = null;

        if (request.body.ContactPersonId === undefined && request.body.ContactPerson !== undefined) {
            contactPerson = {
                Prefix    : request.body.ContactPerson.Prefix ?? null,
                FirstName : request.body.ContactPerson.FirstName ?? null,
                LastName  : request.body.ContactPerson.LastName ?? null,
                Phone     : request.body.ContactPerson.Phone ?? null,
            };
        }

        var address: AddressDomainModel = null;

        if (request.body.AddressId === undefined && request.body.Address !== undefined) {
            address = {
                Type        : request.body.Address.Type ?? 'Official',
                AddressLine : request.body.Address.AddressLine,
                City        : request.body.Address.FirstName ?? null,
                Country     : request.body.Address.Country ?? null,
                PostalCode  : request.body.Address.PostalCode ?? null,
            };
        }

        const domainModel: EmergencyContactDomainModel = {
            PatientUserId           : request.body.PatientUserId ?? null,
            ContactPersonId         : request.body.ContactPersonId ?? null,
            ContactPerson           : contactPerson,
            ContactRelation         : request.body.ContactRelation ?? null,
            AddressId               : request.body.AddressId ?? null,
            Address                 : address,
            OrganizationId          : request.body.OrganizationId ?? null,
            IsAvailableForEmergency : request.body.IsAvailableForEmergency ?? null,
            TimeOfAvailability      : request.body.TimeOfAvailability ?? null,
            Description             : request.body.Description ?? null,
            AdditionalPhoneNumbers  : request.body.AdditionalPhoneNumbers ?? null
        };

        return domainModel;
    };

    private static async validateCreateBody(request) {

        await body('PatientUserId').exists()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await oneOf([
            body('ContactPersonId').optional({ nullable: true })
                .trim()
                .isUUID()
                .escape(),
            body('ContactPerson').optional({ nullable: true })
                .isObject()
                .notEmpty()
                .withMessage('ContactPerson if added cannot be empty!'),
        ]).run(request);

        if (request.body.ContactPerson !== undefined) {

            await body('ContactPerson.FirstName').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('ContactPerson.Prefix').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('ContactPerson.LastName').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('ContactPerson.Phone').exists()
                .trim()
                .isString()
                .run(request);
        }

        await oneOf([
            body('AddressId').optional({ nullable: true })
                .trim()
                .isUUID()
                .escape(),
            body('Address')
                .optional({ nullable: true })
                .isObject()
                .notEmpty()
                .withMessage('Address if added cannot be empty!'),
        ]).run(request);

        if (request.body.Address !== undefined) {

            await body('Address.AddressLine').exists()
                .trim()
                .isString()
                .run(request);

            await body('Address.City').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('Address.Country').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('Address.PostalCode').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);
        }

        await body('ContactRelation').exists()
            .trim()
            .escape()
            .run(request);

        await body('OrganizationId').optional({ nullable: true })
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

    static create = async (request: express.Request): Promise<EmergencyContactDomainModel> => {
        await EmergencyContactValidator.validateCreateBody(request);
        return EmergencyContactValidator.getCreateDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await EmergencyContactValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await EmergencyContactValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<EmergencyContactSearchFilters> => {
        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('contactPersonId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('isAvailableForEmergency').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('contactRelation').optional()
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

        const isAvailableForEmergency = (request.query.isAvailableForEmergency && request.query.isAvailableForEmergency === 'true')
            ? true : false;

        const filters: EmergencyContactSearchFilters = {
            PatientUserId           : request.query.patientUserId ?? null,
            ContactPersonId         : request.query.contactPersonId ?? null,
            IsAvailableForEmergency : isAvailableForEmergency,
            ContactRelation         : request.query.contactRelation ?? null,
            OrderBy                 : request.query.orderBy ?? 'IsAvailableForEmergency',
            Order                   : request.query.order ?? 'descending',
            PageIndex               : pageIndex,
            ItemsPerPage            : itemsPerPage,
        };
        return filters;
    }

    private static async validateUpdateBody(request) {

        body('ContactPersonId').optional({ nullable: true })
            .trim()
            .isUUID()
            .escape()
            .run(request);

        body('ContactPerson').optional({ nullable: true })
            .isObject()
            .notEmpty()
            .withMessage('ContactPerson if added cannot be empty!')
            .run(request);

        if (request.body.ContactPerson !== undefined) {

            await body('ContactPerson.FirstName').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('ContactPerson.Prefix').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('ContactPerson.LastName').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('ContactPerson.Phone').optional()
                .trim()
                .isString()
                .run(request);
        }

        body('AddressId').optional({ nullable: true })
            .trim()
            .isUUID()
            .escape()
            .run(request);
            
        body('Address')
            .optional({ nullable: true })
            .isObject()
            .notEmpty()
            .withMessage('Address if added cannot be empty!')
            .run(request);

        if (request.body.Address !== undefined) {

            await body('Address.AddressLine').optional()
                .trim()
                .isString()
                .run(request);

            await body('Address.City').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('Address.Country').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);

            await body('Address.PostalCode').optional({ nullable: true })
                .trim()
                .isString()
                .run(request);
        }

        await body('ContactRelation').optional()
            .trim()
            .escape()
            .run(request);

        await body('OrganizationId').optional({ nullable: true })
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

    static update = async (request: express.Request): Promise<EmergencyContactDomainModel> => {

        const id = await EmergencyContactValidator.getParamId(request);
        await EmergencyContactValidator.validateUpdateBody(request);

        const domainModel = EmergencyContactValidator.getCreateDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

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
