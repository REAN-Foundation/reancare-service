import express from 'express';
import { query, body, validationResult, param } from 'express-validator';
import { DonorDomainModel } from '../../../domain.types/users/donor/donor.domain.model';
import { Helper } from '../../../common/helper';
import { DonorSearchFilters } from '../../../domain.types/users/donor/donor.search.types';
import { DonorType } from '../../../domain.types/miscellaneous/clinical.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DonorValidator {

    static getDomainModel = (request: express.Request): DonorDomainModel => {

        const birthdate = request.body.BirthDate != null && request.body.BirthDate !== undefined
            ? new Date(Date.parse(request.body.BirthDate))
            : null;

        const phone = request.body.Phone;

        const entity: DonorDomainModel = {
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
            MedIssues         : request.body.MedIssues ?? [],
            BloodGroup        : request.body.BloodGroup ?? null,
            AcceptorUserId    : request.body.AcceptorUserId ?? null,
            LastDonationDate  : request.body.LastDonationDate ?? null,
            IsAvailable       : request.body.IsAvailable ?? false,
            HasDonatedEarlier : request.body.HasDonatedEarlier ?? false,
            DonorType         : request.body.DonorType ?? DonorType.BloodBridge,
            AddressId         : request.body.AddressId,
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
    ): Promise<DonorDomainModel> => {
        await DonorValidator.validateBody(request, true);
        return DonorValidator.getDomainModel(request);
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

        await body('AcceptorUserId').optional()
            .trim()
            .escape()
            .run(request);

        await body('LastDonationDate').optional()
            .trim()
            .escape()
            .run(request);

        await body('DonorType').optional()
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
        await DonorValidator.GetParamUserId(request);
        return request.params.userId;
    };

    static delete = async (request: express.Request): Promise<string> => {
        await DonorValidator.GetParamUserId(request);
        return request.params.userId;
    };

    static search = async (
        request: express.Request
    ): Promise<DonorSearchFilters> => {

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

        await query('donorType').optional()
            .trim()
            .escape()
            .run(request);

        await query('gender').optional()
            .isAlpha()
            .trim()
            .escape()
            .run(request);

        await query('acceptorUserId').optional()
            .trim()
            .escape()
            .run(request);

        await query('isAvailable')
            .optional()
            .isBoolean()
            .trim()
            .escape()
            .run(request);

        await query('onlyEligible')
            .optional()
            .isBoolean()
            .run(request);

        await query('hasDonatedEarlier')
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

        return DonorValidator.getFilter(request);
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

    private static getFilter(request): DonorSearchFilters {

        const pageIndex =
            request.query.pageIndex !== 'undefined'
                ? parseInt(request.query.pageIndex as string, 10)
                : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined'
                ? parseInt(request.query.itemsPerPage as string, 10)
                : 25;

        const filters: DonorSearchFilters = {
            Phone             : request.query.phone ?? null,
            Email             : request.query.email ?? null,
            Name              : request.query.name ?? null,
            Gender            : request.query.gender ?? null,
            AcceptorUserId    : request.query.acceptorUserId ?? null,
            BloodGroup        : request.query.bloodGroup ?? null,
            DonorType         : request.query.donorType ?? null,
            MedIssues         : request.query.medIssues ?? null,
            OnlyEligible      : request.query.onlyEligible ?? null,
            IsAvailable       : request.query.isAvailable ?? null,
            HasDonatedEarlier : request.query.hasDonatedEarlier ?? null,
            CreatedDateFrom   : request.query.createdDateFrom ?? null,
            CreatedDateTo     : request.query.createdDateTo ?? null,
            OrderBy           : request.query.orderBy ?? 'CreatedAt',
            Order             : request.query.order ?? 'descending',
            PageIndex         : pageIndex,
            ItemsPerPage      : itemsPerPage,
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

    static updateByUserId = async (request: express.Request): Promise<DonorDomainModel> => {

        const userId = await DonorValidator.getParamUserId(request);
        await DonorValidator.validateBody(request, false);

        var domainModel = DonorValidator.getDomainModel(request);
        domainModel.UserId = userId;

        return domainModel;
    };

}
