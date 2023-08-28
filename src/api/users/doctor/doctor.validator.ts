import express from 'express';
import { query, body, validationResult, param } from 'express-validator';
import { Helper } from '../../../common/helper';
import { DoctorDomainModel } from '../../../domain.types/users/doctor/doctor.domain.model';
import { DoctorSearchFilters } from '../../../domain.types/users/doctor/doctor.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorValidator {

    static getDomainModel = (request: express.Request): DoctorDomainModel => {

        const birthdate = request.body.BirthDate != null && request.body.BirthDate !== undefined
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

    static create = async (
        request: express.Request
    ): Promise<DoctorDomainModel> => {
        await DoctorValidator.validateBody(request, true);
        return DoctorValidator.getDomainModel(request);
    };

    private static async validateBody(request, create = true) {

        if (create) {
            await body('Phone')
                .exists()
                .notEmpty()
                .trim()
                .escape()
                .customSanitizer(Helper.sanitizePhone)
                .custom(Helper.validatePhone)
                .run(request);
        }
        else {
            await body('Phone')
                .optional()
                .notEmpty()
                .trim()
                .escape()
                .customSanitizer(Helper.sanitizePhone)
                .custom(Helper.validatePhone)
                .run(request);
        }

        await body('Email').optional()
            .trim()
            .isEmail()
            .escape()
            .normalizeEmail()
            .run(request);

        await body('FirstName').optional()
            .trim()
            .escape()
            .run(request);

        await body('LastName').optional()
            .trim()
            .escape()
            .run(request);

        await body('Prefix').optional()
            .trim()
            .escape()
            .run(request);

        await body('Gender').optional()
            .trim()
            .escape()
            .run(request);

        await body('BirthDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await body('ImageResourceId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('NationalDigiDoctorId').optional()
            .trim()
            .isLength({ min: 3 })
            .run(request);

        await body('About').optional()
            .trim()
            .isLength({ min: 10 })
            .run(request);

        await body('Locality').optional()
            .trim()
            .isLength({ min: 3 })
            .run(request);

        await body('Qualifications').optional()
            .trim()
            .isLength({ min: 3 })
            .run(request);

        await body('Specialities').optional()
            .trim()
            .isArray()
            .run(request);

        await body('PractisingSince')
            .optional()
            .trim()
            .escape()
            .toDate()
            .isDate()
            .run(request);

        await body('ProfessionalHighlights').optional()
            .trim()
            .isArray()
            .run(request);

        await body('AddressIds')
            .optional()
            .trim()
            .isArray()
            .run(request);

        await body('OrganizationIds')
            .optional()
            .trim()
            .isArray()
            .run(request);

        await body('AvailabilitySchedule')
            .optional()
            .trim()
            .escape()
            .isObject()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    static getByUserId = async (request: express.Request): Promise<string> => {
        await DoctorValidator.GetParamUserId(request);
        return request.params.userId;
    };

    static delete = async (request: express.Request): Promise<string> => {
        await DoctorValidator.GetParamUserId(request);
        return request.params.userId;
    };

    static search = async (
        request: express.Request
    ): Promise<DoctorSearchFilters> => {

        await query('phone').optional()
            .trim()
            .run(request);

        await query('email').optional()
            .trim()
            .escape()
            .run(request);

        await query('name').optional()
            .trim()
            .escape()
            .run(request);

        await query('gender').optional()
            .isAlpha()
            .trim()
            .escape()
            .run(request);

        await query('practisingSinceFrom')
            .optional()
            .trim()
            .escape()
            .isDate()
            .toDate()
            .run(request);

        await query('practisingSinceTo')
            .optional()
            .trim()
            .escape()
            .isDate()
            .toDate()
            .run(request);

        await query('locality')
            .optional()
            .trim()
            .escape()
            .run(request);

        await query('qualifications')
            .optional()
            .trim()
            .escape()
            .run(request);

        await query('specialities')
            .optional()
            .trim()
            .escape()
            .run(request);

        await query('professionalHighlights')
            .optional()
            .trim()
            .escape()
            .run(request);

        await query('consultationFeeFrom')
            .optional()
            .trim()
            .escape()
            .run(request);

        await query('consultationFeeTo')
            .optional()
            .trim()
            .escape()
            .run(request);

        await query('createdDateFrom')
            .optional()
            .isDate()
            .trim()
            .escape()
            .run(request);

        await query('createdDateTo')
            .optional()
            .isDate()
            .trim()
            .escape()
            .run(request);

        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex')
            .optional()
            .isInt()
            .trim()
            .escape()
            .run(request);

        await query('itemsPerPage')
            .optional()
            .isInt()
            .trim()
            .escape()
            .run(request);

        await query('fullDetails').optional()
            .isBoolean()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return DoctorValidator.getFilter(request);
    };

    private static async GetParamUserId(request) {

        await param('userId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): DoctorSearchFilters {

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

    private static async getParamUserId(request) {

        await param('userId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.userId;
    }

    static updateByUserId = async (request: express.Request): Promise<DoctorDomainModel> => {

        const userId = await DoctorValidator.getParamUserId(request);
        await DoctorValidator.validateBody(request, false);

        var domainModel = DoctorValidator.getDomainModel(request);
        domainModel.UserId = userId;

        return domainModel;
    };

}
