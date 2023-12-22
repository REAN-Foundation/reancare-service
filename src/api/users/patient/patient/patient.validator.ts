/* eslint-disable max-len */
import express from 'express';
import { body } from 'express-validator';
import { PatientDomainModel } from '../../../../domain.types/users/patient/patient/patient.domain.model';
import { PatientSearchFilters } from '../../../../domain.types/users/patient/patient/patient.search.types';
import { BaseValidator, Where } from '../../../base.validator';
import { Helper } from '../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = async (request: express.Request): Promise<PatientDomainModel> => {

        const birthdate = request.body.BirthDate != null && request.body.BirthDate !== undefined
            ? new Date(Date.parse(request.body.BirthDate))
            : null;

        const patientAge = Helper.getAgeFromBirthDate(birthdate);
        const phone = request.body.Phone;

        const entity: PatientDomainModel = {
            User : {
                Person : {
                    FirstName                 : request.body.FirstName ?? null,
                    LastName                  : request.body.LastName ?? null,
                    Prefix                    : request.body.Prefix ?? null,
                    Phone                     : phone,
                    Email                     : request.body.Email ?? null,
                    TelegramChatId            : request.body.TelegramChatId ?? null,
                    Gender                    : request.body.Gender ?? null,
                    SelfIdentifiedGender      : request.body.SelfIdentifiedGender ?? null,
                    MaritalStatus             : request.body.MaritalStatus ?? null,
                    Race                      : request.body.Race ?? null,
                    Ethnicity                 : request.body.Ethnicity ?? null,
                    BirthDate                 : birthdate,
                    Age                       : request.body.Age ?? patientAge,
                    StrokeSurvivorOrCaregiver : request.body.StrokeSurvivorOrCaregiver ?? null,
                    LivingAlone               : request.body.LivingAlone ?? null,
                    WorkedPriorToStroke       : request.body.WorkedPriorToStroke ?? null,
                    ImageResourceId           : request.body.ImageResourceId ?? null,
                },
                id              : request.params.userId,
                Password        : request.body.Password ?? null,
                UserName        : request.body.UserName ?? null,
                DefaultTimeZone : request.body.DefaultTimeZone ?? null,
                CurrentTimeZone : request.body.CurrentTimeZone ?? null,
                TenantId        : request.body.TenantId ?? null,
            },
            HealthProfile : {
                BloodGroup           : request.body.BloodGroup ?? null,
                BloodTransfusionDate : request.body.BloodTransfusionDate ?? null,
                BloodDonationCycle   : request.body.BloodDonationCycle ?? null,
                OtherInformation     : request.body.OtherInformation ?? null,
            },
            UserId   : request.params.userId ?? null,
            Address  : request.body.Address ?? null,
            CohortId : request.body.CohortId ?? null,
        };

        return entity;
    };

    getUpdateDomainModel = async (request: express.Request): Promise<PatientDomainModel> => {

        const body = request.body;
        const birthdate = body.BirthDate !== undefined ?
            (body.BirthDate !== null ? new Date(Date.parse(body.BirthDate)) : null) : undefined;

        const patientAge = birthdate ? Helper.getAgeFromBirthDate(birthdate) : undefined;

        const entity: PatientDomainModel = {
            User : {
                Person : {
                    FirstName                 : body.FirstName !== undefined ? body.FirstName                                : undefined,
                    LastName                  : body.LastName !== undefined ? body.LastName                                  : undefined,
                    Prefix                    : body.Prefix !== undefined ? body.Prefix                                      : undefined,
                    Phone                     : body.Phone !== undefined ? body.Phone                                        : undefined,
                    Email                     : body.Email !== undefined ? body.Email                                        : undefined,
                    TelegramChatId            : body.TelegramChatId !== undefined ? body.TelegramChatId                      : undefined,
                    Gender                    : body.Gender !== undefined ? body.Gender                                      : undefined,
                    SelfIdentifiedGender      : body.SelfIdentifiedGender !== undefined ? body.SelfIdentifiedGender          : undefined,
                    MaritalStatus             : body.MaritalStatus !== undefined ? body.MaritalStatus                        : undefined,
                    Race                      : body.Race !== undefined ? body.Race                                          : undefined,
                    Ethnicity                 : body.Ethnicity !== undefined ? body.Ethnicity                                : undefined,
                    BirthDate                 : birthdate,
                    Age                       : body.Age !== undefined ? body.Age                                            : patientAge,
                    StrokeSurvivorOrCaregiver : body.StrokeSurvivorOrCaregiver !== undefined ? body.StrokeSurvivorOrCaregiver : undefined,
                    LivingAlone               : body.LivingAlone !== undefined ? body.LivingAlone                            : undefined,
                    WorkedPriorToStroke       : body.WorkedPriorToStroke !== undefined ? body.WorkedPriorToStroke            : undefined,
                    ImageResourceId           : body.ImageResourceId !== undefined ? body.ImageResourceId                    : undefined,
                },
                Password        : body.Password ?? null,
                DefaultTimeZone : body.DefaultTimeZone ?? null,
                CurrentTimeZone : body.CurrentTimeZone ?? null,
                TenantId        : body.TenantId ?? null,
            },
            HealthProfile : {
                OtherInformation : body.OtherInformation !== undefined ? body.OtherInformation : undefined,
                BloodGroup       : body.BloodGroup ?? null,
            },
            Address           : body.Address ?? null,
            DonorAcceptance   : body.DonorAcceptance ?? null,
            IsRemindersLoaded : body.IsRemindersLoaded ?? false,
            CohortId          : body.CohortId !== undefined ? body.CohortId : undefined,
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
        await this.validateString(request, 'donorAcceptance', Where.Query, false, false);
        await this.validateDateString(request, 'birthdateFrom', Where.Query, false, false);
        await this.validateDateString(request, 'birthdateTo', Where.Query, false, false);
        await this.validateUuid(request, 'birthdateTo', Where.Query, false, false);
        await this.validateString(request, 'userName', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);

        return this.getFilter(request);
    };

    private getFilter(request): PatientSearchFilters {

        const filters: PatientSearchFilters = {
            Phone           : request.query.phone ?? null,
            Email           : request.query.email ?? null,
            Name            : request.query.name ?? null,
            Gender          : request.query.gender ?? null,
            DonorAcceptance : request.query.donorAcceptance ?? null,
            BirthdateFrom   : request.query.birthdateFrom ?? null,
            BirthdateTo     : request.query.birthdateTo ?? null,
            UserName        : request.query.userName ?? null,
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
        await this.validateString(request, 'TelegramChatId', Where.Body, false, true);
        await this.validateString(request, 'Prefix', Where.Body, false, true);
        await this.validateString(request, 'FirstName', Where.Body, false, true);
        await this.validateString(request, 'LastName', Where.Body, false, true);
        await this.validateString(request, 'Gender', Where.Body, false, true);
        await this.validateString(request, 'SelfIdentifiedGender', Where.Body, false, true);
        await this.validateString(request, 'MaritalStatus', Where.Body, false, true);
        await this.validateString(request, 'Race', Where.Body, false, true);
        await this.validateString(request, 'Ethnicity', Where.Body, false, true);
        await this.validateDate(request, 'BirthDate', Where.Body, false, true);
        await this.validateString(request, 'Age', Where.Body, false, true);
        await this.validateString(request, 'StrokeSurvivorOrCaregiver', Where.Body, false, true);
        await this.validateBoolean(request, 'LivingAlone', Where.Body, false, true);
        await this.validateBoolean(request, 'WorkedPriorToStroke', Where.Body, false, true);
        await this.validateUuid(request, 'ImageResourceId', Where.Body, false, true);
        await this.validateString(request, 'DonorAcceptance', Where.Body, false, false);
        await this.validateBoolean(request, 'IsRemindersLoaded', Where.Body, false, true);
        await this.validateUuid(request, 'TenantId', Where.Body, false, true);
        await this.validateUuid(request, 'CohortId', Where.Body, false, true);
        await this.validateString(request, 'OtherInformation', Where.Body, false, true);
        await this.validateString(request, 'UserName', Where.Body, false, true);

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
