import express from 'express';
import { body, oneOf } from 'express-validator';
import { AddressDomainModel } from '../../../../domain.types/general/address/address.domain.model';
import { EmergencyContactDomainModel } from '../../../../domain.types/users/patient/emergency.contact/emergency.contact.domain.model';
import { EmergencyContactSearchFilters } from '../../../../domain.types/users/patient/emergency.contact/emergency.contact.search.types';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyContactValidator extends BaseValidator {

    getCreateDomainModel = (request: express.Request): EmergencyContactDomainModel => {

        var contactPerson: PersonDomainModel = null;

        if (request.body.ContactPersonId === undefined && request.body.ContactPerson !== undefined) {
            contactPerson = {
                Prefix    : request.body.ContactPerson.Prefix ?? null,
                FirstName : request.body.ContactPerson.FirstName ?? null,
                LastName  : request.body.ContactPerson.LastName ?? null,
                Phone     : request.body.ContactPerson.Phone ?? null,
                Email     : request.body.ContactPerson.Email ?? null,
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
            AdditionalPhoneNumbers  : request.body.AdditionalPhoneNumbers ?? null,
        };

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'AddressId', Where.Body, false, false);
        await this.validateString(request, 'Address', Where.Body, true, false);
        await this.validateString(request, 'ContactRelation', Where.Body, true, false);
        await this.validateUuid(request, 'OrganizationId', Where.Body, false, false);
        await this.validateBoolean(request, 'IsAvailableForEmergency', Where.Body, true, false);
        await this.validateString(request, 'TimeOfAvailability', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'AdditionalPhoneNumbers', Where.Body, false, false);

        this.validateRequest(request);

        await oneOf([
            body('ContactPersonId').optional({ nullable: true })
                .isUUID(),
            body('ContactPerson').optional({ nullable: true })
                .isObject()
                .notEmpty()
                .withMessage('ContactPerson if added cannot be empty!'),
        ]).run(request);

        if (request.body.ContactPerson !== undefined) {

            await this.validateString(request, 'ContactPerson.FirstName', Where.Body, false, true);
            await this.validateString(request, 'ContactPerson.Prefix', Where.Body, false, true);
            await this.validateString(request, 'ContactPerson.LastName', Where.Body, false, true);
            await this.validateString(request, 'ContactPerson.Phone', Where.Body, true, false);
            await this.validateEmail(request, 'ContactPerson.Email', Where.Body, false, true);

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

            await this.validateString(request, 'Address.AddressLine', Where.Body, true, false);
            await this.validateString(request, 'Address.City', Where.Body, false, true);
            await this.validateString(request, 'Address.Country', Where.Body, false, true);
            await this.validateString(request, 'Address.PostalCode', Where.Body, false, true);

        }
    }

    create = async (request: express.Request): Promise<EmergencyContactDomainModel> => {
        await this.validateCreateBody(request);
        return this.getCreateDomainModel(request);
    };

    search = async (request: express.Request): Promise<EmergencyContactSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'contactPersonId', Where.Query, false, false);
        await this.validateBoolean(request, 'isAvailableForEmergency', Where.Query, false, false);
        await this.validateString(request, 'contactRelation', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);

    };

    private getFilter(request): EmergencyContactSearchFilters {

        var filters: EmergencyContactSearchFilters = {
            PatientUserId           : request.query.patientUserId ?? null,
            ContactPersonId         : request.query.contactPersonId ?? null,
            IsAvailableForEmergency : request.query.isAvailableForEmergency,
            ContactRelation         : request.query.contactRelation ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'ContactPersonId', Where.Body, false, false);
        await this.validateString(request, 'ContactPerson', Where.Body, false, false);
        await this.validateUuid(request, 'AddressId', Where.Body, false, false);
        await this.validateString(request, 'Address', Where.Body, false, false);
        await this.validateString(request, 'ContactRelation', Where.Body, false, false);
        await this.validateUuid(request, 'OrganizationId', Where.Body, false, false);
        await this.validateBoolean(request, 'IsAvailableForEmergency', Where.Body, false, false);
        await this.validateString(request, 'TimeOfAvailability', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'AdditionalPhoneNumbers', Where.Body, false, false);

        this.validateRequest(request);

        if (request.body.ContactPerson !== undefined) {

            await this.validateString(request, 'ContactPerson.FirstName', Where.Body, false, false);
            await this.validateString(request, 'ContactPerson.Prefix', Where.Body, false, false);
            await this.validateString(request, 'ContactPerson.LastName', Where.Body, false, false);
            await this.validateString(request, 'ContactPerson.Phone', Where.Body, false, false);
            await this.validateEmail(request, 'ContactPerson.Email', Where.Body, false, false);

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

            await this.validateString(request, 'Address.AddressLine', Where.Body, false, false);
            await this.validateString(request, 'Address.City', Where.Body, false, false);
            await this.validateString(request, 'Address.Country', Where.Body, false, false);
            await this.validateString(request, 'Address.PostalCode', Where.Body, false, false);

        }
    }

    update = async (request: express.Request): Promise<EmergencyContactDomainModel> => {

        await this.validateUpdateBody(request);

        const domainModel = this.getCreateDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

}
