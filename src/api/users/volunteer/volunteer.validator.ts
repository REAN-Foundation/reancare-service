import express from 'express';
import { query, body, validationResult, param } from 'express-validator';
import { VolunteerSearchFilters } from '../../../domain.types/users/Volunteer/volunteer.search.types';
import { Helper } from '../../../common/helper';
import { VolunteerDomainModel } from '../../../domain.types/users/Volunteer/volunteer.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class VolunteerValidator {

    static getDomainModel = (request: express.Request): VolunteerDomainModel => {

        const birthdate = request.body.BirthDate != null && request.body.BirthDate !== undefined
            ? new Date(Date.parse(request.body.BirthDate))
            : null;

        const phone = request.body.Phone;

        const entity: VolunteerDomainModel = {
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
            MedIssues            : request.body.MedIssues ?? null,
            BloodGroup           : request.body.BloodGroup ?? null,
            SelectedBridgeId     : request.body.SelectedBridgeId ?? null,
            SelectedBloodGroup   : request.body.SelectedBloodGroup ?? null,
            SelectedPhoneNumber  : request.body.SelectedPhoneNumber ?? null,
            LastDonationRecordId : request.body.LastDonationRecordId ?? null,
            LastDonationDate     : request.body.LastDonationDate ?? null,
            IsAvailable          : request.body.IsAvailable ?? false,
            AddressId            : request.body.AddressId,
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
    ): Promise<VolunteerDomainModel> => {
        await VolunteerValidator.validateBody(request, true);
        return VolunteerValidator.getDomainModel(request);
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

        await body('BloodGroup').optional()
            .trim()
            .escape()
            .run(request);

        await body('SelectedBloodGroup').optional()
            .trim()
            .escape()
            .run(request);

        await body('SelectedBridgeId').optional()
            .trim()
            .escape()
            .run(request);

        await body('SelectedPhoneNumber').optional()
            .trim()
            .escape()
            .run(request);

        await body('LastDonationRecordId').optional()
            .trim()
            .escape()
            .run(request);

        await body('LastDonationDate').optional()
            .trim()
            .escape()
            .run(request);

        await body('MedIssues').optional()
            .run(request);

        await body('AddressId')
            .optional()
            .trim()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    static getByUserId = async (request: express.Request): Promise<string> => {
        await VolunteerValidator.GetParamUserId(request);
        return request.params.userId;
    };

    static delete = async (request: express.Request): Promise<string> => {
        await VolunteerValidator.GetParamUserId(request);
        return request.params.userId;
    };

    static search = async (
        request: express.Request
    ): Promise<VolunteerSearchFilters> => {

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

        await query('bloodGroup')
            .optional();

        await query('selectedBridgeId').optional()
            .trim()
            .run(request);

        await query('selectedBloodGroup').optional()
            .trim()
            .run(request);

        await query('isAvailable')
            .optional()
            .isBoolean()
            .trim()
            .escape()
            .run(request);

        await query('medIssues')
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

        return VolunteerValidator.getFilter(request);
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

    private static getFilter(request): VolunteerSearchFilters {

        const pageIndex =
            request.query.pageIndex !== 'undefined'
                ? parseInt(request.query.pageIndex as string, 10)
                : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined'
                ? parseInt(request.query.itemsPerPage as string, 10)
                : 25;

        const filters: VolunteerSearchFilters = {
            Phone              : request.query.phone ?? null,
            Email              : request.query.email ?? null,
            Name               : request.query.name ?? null,
            Gender             : request.query.gender ?? null,
            BloodGroup         : request.query.bloodGroup ?? null,
            SelectedBridgeId   : request.query.selectedBridgeId ?? null,
            SelectedBloodGroup : request.query.selectedBloodGroup ?? null,
            MedIssues          : request.query.medIssues ?? null,
            IsAvailable        : request.query.isAvailable ?? null,
            CreatedDateFrom    : request.query.createdDateFrom ?? null,
            CreatedDateTo      : request.query.createdDateTo ?? null,
            OrderBy            : request.query.orderBy ?? 'CreatedAt',
            Order              : request.query.order ?? 'descending',
            PageIndex          : pageIndex,
            ItemsPerPage       : itemsPerPage,
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

    static updateByUserId = async (request: express.Request): Promise<VolunteerDomainModel> => {

        const userId = await VolunteerValidator.getParamUserId(request);
        await VolunteerValidator.validateBody(request, false);

        var domainModel = VolunteerValidator.getDomainModel(request);
        domainModel.UserId = userId;

        return domainModel;
    };

}
