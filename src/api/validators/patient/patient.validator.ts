import express from 'express';
import { body } from 'express-validator';
import { PatientDomainModel } from '../../../domain.types/patient/patient/patient.domain.model';
import { PatientSearchFilters } from '../../../domain.types/patient/patient/patient.search.types';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = async (request: express.Request): Promise<PatientDomainModel> => {
        
        const birthdate = request.body.BirthDate != null && typeof request.body.BirthDate !== undefined
            ? new Date(Date.parse(request.body.BirthDate))
            : null;

        const phone = request.body.Phone;

        const entity: PatientDomainModel = {
            User : {
                Person : {
                    FirstName       : request.body.FirstName ?? null,
                    LastName        : request.body.LastName ?? null,
                    Prefix          : request.body.Prefix ?? null,
                    Phone           : phone,
                    Email           : request.body.Email ?? null,
                    Gender          : request.body.Gender ?? null,
                    BirthDate       : birthdate,
                    ImageResourceId : request.body.ImageResourceId ?? null,
                },
                id              : request.params.userId,
                Password        : request.body.Password ?? null,
                DefaultTimeZone : request.body.DefaultTimeZone ?? null,
                CurrentTimeZone : request.body.CurrentTimeZone ?? null,
            },
            UserId  : request.params.userId ?? null,
            Address : request.body.Address ?? null,
        };

        return entity;
    };

    getUpdateDomainModel = async (request: express.Request): Promise<PatientDomainModel> => {
        
        const birthdate = request.body.BirthDate !== undefined ?
            (request.body.BirthDate !== null ? new Date(Date.parse(request.body.BirthDate)) : null) : undefined;

        const entity: PatientDomainModel = {
            User : {
                Person : {
                    FirstName       : request.body.FirstName !== undefined ? request.body.FirstName : undefined,
                    LastName        : request.body.LastName !== undefined ? request.body.LastName : undefined,
                    Prefix          : request.body.Prefix !== undefined ? request.body.Prefix : undefined,
                    Email           : request.body.Email !== undefined ? request.body.Email : undefined,
                    Gender          : request.body.Gender !== undefined ? request.body.Gender : undefined,
                    BirthDate       : birthdate,
                    ImageResourceId : request.body.ImageResourceId !== undefined ?
                        request.body.ImageResourceId : undefined,
                },
                Password        : request.body.Password ?? null,
                DefaultTimeZone : request.body.DefaultTimeZone ?? null,
                CurrentTimeZone : request.body.CurrentTimeZone ?? null,
            },
        };

        return entity;
    };

    create = async (request: express.Request): Promise<PatientDomainModel> => {
        await this.validateBody(request, true);
        return this.getCreateDomainModel(request);
    };

    search = async (request: express.Request): Promise<PatientSearchFilters> => {

        await this.validateString(request, 'phone', Where.Query, false, false);
        await this.validateEmail(request, 'email', Where.Query, false, true);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'gender', Where.Query, false, false);
        await this.validateDateString(request, 'birthdateFrom', Where.Query, false, false);
        await this.validateDateString(request, 'birthdateTo', Where.Query, false, false);
        await this.validateUuid(request, 'birthdateTo', Where.Query, false, false);
        
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);

        return this.getFilter(request);
    };

    private getFilter(request): PatientSearchFilters {
        
        const filters: PatientSearchFilters = {
            Phone         : request.query.phone ?? null,
            Email         : request.query.email ?? null,
            Name          : request.query.name ?? null,
            Gender        : request.query.gender ?? null,
            BirthdateFrom : request.query.birthdateFrom ?? null,
            BirthdateTo   : request.query.birthdateTo ?? null,
        };
        
        return this.updateBaseSearchFilters(request, filters);
    }

    updateByUserId = async (request: express.Request): Promise<PatientDomainModel> => {
        await this.validateBody(request, false);
        return this.getUpdateDomainModel(request);
    };

    private async validateBody(request: express.Request, create = true): Promise<void> {
        
        await this.validateString(request, 'Phone', Where.Body, create, false);
        await this.validateEmail(request, 'Email', Where.Body, false, true);
        await this.validateString(request, 'Prefix', Where.Body, false, true);
        await this.validateString(request, 'FirstName', Where.Body, false, true);
        await this.validateString(request, 'LastName', Where.Body, false, true);
        await this.validateString(request, 'Gender', Where.Body, false, true);
        await this.validateDate(request, 'BirthDate', Where.Body, false, true);
        await this.validateUuid(request, 'ImageResourceId', Where.Body, false, true);

        await body('AddressIds').optional()
            .isArray()
            .toArray()
            .run(request);

        await body('Addresses').optional()
            .isArray()
            .run(request);

        this.validateRequest(request);
    }

}
