import express from 'express';
import { Helper } from '../../common/helper';
import { DoctorDomainModel } from '../../domain.types/doctor/doctor.domain.model';
import { DoctorSearchFilters } from '../../domain.types/doctor/doctor.search.types';
import { BaseValidator, Where } from './base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): DoctorDomainModel => {

        const birthdate = request.body.BirthDate != null && typeof request.body.BirthDate !== undefined
            ? new Date(Date.parse(request.body.BirthDate))
            : null;

        const phone = request.body.Phone;

        const entity: DoctorDomainModel = {
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
                id               : request.params.userId,
                Password         : request.body.Password ?? null,
                DefaultTimeZone  : request.body.DefaultTimeZone ?? null,
                CurrentTimeZone  : request.body.DefaultTimeZone ?? null,
                GenerateLoginOTP : request.body.DefaultTimeZone ?? null,
            },
            NationalDigiDoctorId   : request.body.NationalDigiDoctorId ?? null,
            Qualifications         : request.body.Qualifications ?? null,
            Specialities           : request.body.Specialities ?? null,
            About                  : request.body.About ?? null,
            PractisingSince        : request.body.PractisingSince ?? null,
            ProfessionalHighlights : request.body.ProfessionalHighlights ?? null,
            AvailabilitySchedule   : request.body.AvailabilitySchedule ?? null,
            ConsultationFee        : request.body.ConsultationFee ?? null,
            OrganizationIds        : request.body.OrganizationIds ?? null,
            AddressIds             : request.body.AddressIds,
        };

        if (
            entity.User.Person.Gender != null &&
            entity.User.Person.Prefix == null
        ) {
            entity.User.Person.Prefix = Helper.guessPrefixByGender(
                entity.User.Person.Gender
            );
        }

        return entity;
    };

    create = async ( request: express.Request): Promise<DoctorDomainModel> => {
    
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
        
    };

    private async validateCreateBody(request) {

        await this.validateString(request, 'phone', Where.Query, false, false);
        await this.validateString(request, 'Email', Where.Query, false, false);
        await this.validateString(request, 'FirstName', Where.Query, false, false);
        await this.validateString(request, 'LastName', Where.Query, false, false);
        await this.validateString(request, 'Prefix', Where.Query, false, false);
        await this.validateString(request, 'Gender', Where.Query, false, false);
        await this.validateString(request, 'BirthDate', Where.Query, false, false);
        await this.validateString(request, 'ImageResourceId', Where.Query, false, false);
        await this.validateString(request, 'NationalDigiDoctorId', Where.Query, false, false);
        await this.validateString(request, 'About', Where.Query, false, false);
        await this.validateString(request, 'Locality', Where.Query, false, false);
        await this.validateString(request, 'Qualifications', Where.Query, false, false);
        await this.validateString(request, 'Specialities', Where.Query, false, false);
        await this.validateString(request, 'PractisingSince', Where.Query, false, false);
        await this.validateString(request, 'ProfessionalHighlights', Where.Query, false, false);
        await this.validateString(request, 'AddressIds', Where.Query, false, false);
        await this.validateString(request, 'OrganizationIds', Where.Query, false, false);
        await this.validateString(request, 'AvailabilitySchedule', Where.Query, false, false);

        this.validateRequest(request);
    }

    // getByUserId = async (request: express.Request): Promise<string> => {
    //     await DoctorValidator.GetParamUserId(request);
    //     return request.params.userId;
    // };

    // delete = async (request: express.Request): Promise<string> => {
    //     await DoctorValidator.GetParamUserId(request);
    //     return request.params.userId;
    // }

    search = async (request: express.Request): Promise<DoctorSearchFilters> => {

        await this.validateUuid(request, 'phone', Where.Query, false, false);
        await this.validateUuid(request, 'email', Where.Query, false, false);
        await this.validateUuid(request, 'name', Where.Query, false, false);
        await this.validateUuid(request, 'gender', Where.Query, false, false);
        await this.validateDate(request, 'practisingSinceFrom', Where.Query, false, false);
        await this.validateDate(request, 'practisingSinceTo', Where.Query, false, false);
        await this.validateString(request, 'locality', Where.Query, false, false);
        await this.validateString(request, 'qualifications', Where.Query, false, false);
        await this.validateString(request, 'specialities', Where.Query, false, false);
        await this.validateString(request, 'professionalHighlights', Where.Query, false, false);
        await this.validateDate(request, 'consultationFeeFrom', Where.Query, false, false);
        await this.validateDate(request, 'consultationFeeTo', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'orderBy', Where.Query, false, false);
        await this.validateUuid(request, 'order', Where.Query, false, false);
        await this.validateUuid(request, 'pageIndex', Where.Query, false, false);
        await this.validateUuid(request, 'itemsPerPage', Where.Query, false, false);
        await this.validateString(request, 'fullDetails', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);
    };

    GetParamUserId = async(request) => {

        await this.validateUuid(request, 'phone', Where.Query, false, false);
        
        this.validateRequest(request);
        
    }

    private getFilter(request): DoctorSearchFilters {

        const pageIndex =
            request.query.pageIndex !== 'undefined'
                ? parseInt(request.query.pageIndex as string, 10)
                : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined'
                ? parseInt(request.query.itemsPerPage as string, 10)
                : 25;

        const filters: DoctorSearchFilters = {
            Phone                  : request.query.phone ?? null,
            Email                  : request.query.email ?? null,
            Name                   : request.query.name ?? null,
            Gender                 : request.query.gender ?? null,
            PractisingSinceFrom    : request.query.practisingSinceFrom ?? null,
            PractisingSinceTo      : request.query.practisingSinceTo ?? null,
            Locality               : request.query.locality ?? null,
            Qualifications         : request.query.qualifications ?? null,
            Specialities           : request.query.specialities ?? null,
            ProfessionalHighlights : request.query.professionalHighlights ?? null,
            ConsultationFeeFrom    : request.query.consultationFeeFrom ?? null,
            ConsultationFeeTo      : request.query.consultationFeeTo ?? null,
            CreatedDateFrom        : request.query.createdDateFrom ?? null,
            CreatedDateTo          : request.query.createdDateTo ?? null,
            OrderBy                : request.query.orderBy ?? 'CreatedAt',
            Order                  : request.query.order ?? 'descending',
            PageIndex              : pageIndex,
            ItemsPerPage           : itemsPerPage,
        };

        return filters;
    }

    getParamUserId = async (request) => {

        await this.validateUuid(request, 'phone', Where.Query, false, false);

        this.validateRequest(request);
        
        return request.params.userId;
    }

    // updateByUserId = async (request: express.Request): Promise<DoctorDomainModel> => {

    //     const userId = await DoctorValidator.getParamUserId(request);
    //     await DoctorValidator.validateCreateBody(request);

    //     var domainModel = DoctorValidator.getDomainModel(request);
    //     domainModel.UserId = userId;

    //     return domainModel;
    // };

}
