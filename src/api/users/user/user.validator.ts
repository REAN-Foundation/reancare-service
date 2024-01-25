import express from 'express';
import { body, oneOf, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { UserDomainModel, UserExistanceModel, UserLoginDetails } from '../../../domain.types/users/user/user.domain.model';
import { UserSearchFilters } from '../../../domain.types/users/user/user.search.types';
import { Gender, uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserValidator {

    static create = async (request: express.Request): Promise<UserDomainModel> => {

        await body('TenantId').exists()
            .trim()
            .isUUID()
            .run(request);

        await body('RoleId').exists()
            .trim()
            .isNumeric()
            .run(request);

        await body('Prefix').optional()
            .trim()
            .escape()
            .run(request);

        await body('FirstName').exists()
            .trim()
            .escape()
            .run(request);

        await body('MiddleName').optional()
            .trim()
            .escape()
            .run(request);

        await body('LastName').exists()
            .trim()
            .escape()
            .run(request);

        await oneOf([
            body('Phone').optional()
                .trim()
                .escape(),
            body('Email').optional()
                .trim()
                .escape(),
            body('UserName').optional()
                .trim()
                .escape(),
        ]).run(request);

        await body('Password').exists()
            .trim()
            .escape()
            .isStrongPassword({
                minLength                 : 8,
                minLowercase              : 1,
                minUppercase              : 1,
                minNumbers                : 1,
                minSymbols                : 1,
                returnScore               : false,
                pointsPerUnique           : 1,
                pointsPerRepeat           : 0.5,
                pointsForContainingLower  : 10,
                pointsForContainingUpper  : 10,
                pointsForContainingNumber : 10,
                pointsForContainingSymbol : 10,
            })
            .run(request);

        await body('DefaultTimeZone').optional()
            .trim()
            .escape()
            .run(request);

        await body('CurrentTimeZone').optional()
            .trim()
            .escape()
            .run(request);

        await body('IsTestUser').optional()
            .isBoolean()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return UserValidator.getCreateModel(request);

    };

    private static getCreateModel(request): UserDomainModel {

        const model: UserDomainModel = {
            TenantId : request.body.TenantId,
            RoleId   : request.body.RoleId,
            Person   : {
                Prefix     : request.body.Prefix ?? null,
                FirstName  : request.body.FirstName,
                MiddleName : request.body.MiddleName ?? null,
                LastName   : request.body.LastName,
                Phone      : request.body.Phone ?? null,
                Email      : request.body.Email ?? null,
            },
            UserName        : request.body.UserName ?? null,
            Password        : request.body.Password,
            DefaultTimeZone : request.body.DefaultTimeZone ?? null,
            CurrentTimeZone : request.body.CurrentTimeZone ?? null,
            IsTestUser      : request.body.IsTestUser ?? false,
        };

        return model;
    }

    static getById = async (request: express.Request): Promise<string> => {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.params.id;
    };

    static logoutToken = async (request: express.Request): Promise<string> => {

        await body('DeviceToken').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.body.Token;
    };

    static search = async (
        request: express.Request,
        response: express.Response
    ): Promise<UserSearchFilters> => {
        try {
            await query('phone').optional()
                .trim()
                .escape()
                .run(request);

            await query('email').optional()
                .trim()
                .escape()
                .run(request);

            await query('userId').optional()
                .isUUID()
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

            await query('birthdateFrom').optional()
                .isDate()
                .trim()
                .escape()
                .run(request);

            await query('birthdateTo').optional()
                .isDate()
                .trim()
                .escape()
                .run(request);

            await query('createdDateFrom').optional()
                .isDate()
                .trim()
                .escape()
                .run(request);

            await query('createdDateTo').optional()
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

            await query('pageIndex').optional()
                .isInt()
                .trim()
                .escape()
                .run(request);

            await query('itemsPerPage').optional()
                .isInt()
                .trim()
                .escape()
                .run(request);

            await query('full').optional()
                .isBoolean()
                .run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            return UserValidator.getFilter(request);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private static getFilter(request: express.Request): UserSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;
        const tenantId: uuid = request.currentUserTenantId ?? null;

        const filters: UserSearchFilters = {
            TenantId        : tenantId,
            Phone           : request.query.phone as string ?? null,
            Email           : request.query.email as string ?? null,
            UserId          : request.query.userId as string ?? null,
            Name            : request.query.name as string ?? null,
            Gender          : request.query.gender as Gender ?? null,
            BirthdateFrom   : request.query.birthdateFrom ? new Date(request.query.birthdateFrom as string) : null,
            BirthdateTo     : request.query.birthdateTo ? new Date(request.query.birthdateTo as string) : null,
            CreatedDateFrom : request.query.createdDateFrom ? new Date(request.query.createdDateFrom as string) : null,
            CreatedDateTo   : request.query.createdDateTo ? new Date(request.query.createdDateTo as string) : null,
            OrderBy         : request.query.orderBy as string ?? 'CreatedAt',
            Order           : request.query.order as string ?? 'descending',
            PageIndex       : pageIndex,
            ItemsPerPage    : itemsPerPage,
        };
        return filters;
    }

    static loginWithPassword = async (
        request: express.Request,
        response: express.Response
    ): Promise<UserLoginDetails> => {
        try {
            await oneOf([
                body('Phone').optional()
                    .trim()
                    .escape(),
                body('Email').optional()
                    .trim()
                    .escape(),
                body('UserName').optional()
                    .trim()
                    .escape(),
            ]).run(request);

            await body('Password').exists()
                .trim()
                .run(request);

            await body('LoginRoleId').exists()
                .trim()
                .isNumeric()
                .run(request);

            // await oneOf([
            //     body('TenantId')
            //         .trim()
            //         .isUUID(),
            //     body('TenantCode')
            //         .trim()
            //         .escape(),
            // ]).run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            const loginDetails: UserLoginDetails = {
                Phone       : null,
                Email       : null,
                UserName    : null,
                Password    : request.body.Password,
                Otp         : null,
                LoginRoleId : parseInt(request.body.LoginRoleId, 10),
                TenantId    : request.body.TenantId ?? null,
                TenantCode  : request.body.TenantCode ?? null,
            };
            if (typeof request.body.Phone !== 'undefined') {
                loginDetails.Phone = request.body.Phone;
            }
            if (typeof request.body.Email !== 'undefined') {
                loginDetails.Email = request.body.Email;
            }
            if (typeof request.body.UserName !== 'undefined') {
                loginDetails.UserName = request.body.UserName;
            }
            return loginDetails;
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    static userExistsCheck = async (
        request: express.Request): Promise<UserExistanceModel> => {

        await oneOf([
            param('phone').optional()
                .trim()
                .escape(),
            param('email').optional()
                .trim()
                .escape(),
        ]).run(request);

        // await oneOf([
        //     body('TenantId').exists()
        //         .trim()
        //         .isUUID(),
        //     body('TenantCode').exists()
        //         .trim()
        //         .escape(),
        // ]).run(request);

        await param('roleId').exists()
            .trim()
            .isNumeric()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        const userDetails: UserExistanceModel = {
            Phone      : null,
            Email      : null,
            RoleId     : parseInt(request.params.roleId, 10),
            TenantId   : request.body.TenantId ?? null,
            TenantCode : request.body.TenantCode ?? null,
        };
        if (typeof request.params.phone !== 'undefined') {
            userDetails.Phone = request.params.phone;
        }
        if (typeof request.params.email !== 'undefined') {
            userDetails.Email = request.params.email;
        }

        return userDetails;
    };

    static resetPassword = async (request: express.Request, response: express.Response): Promise<any> => {
        try {

            await oneOf([
                body('Phone').optional()
                    .trim()
                    .escape(),
                body('Email').optional()
                    .trim()
                    .escape(),
            ]).run(request);

            // await oneOf([
            //     body('TenantId').exists()
            //         .trim()
            //         .isUUID(),
            //     body('TenantCode').exists()
            //         .trim()
            //         .escape(),
            // ]).run(request);

            await body('NewPassword').exists()
                .trim()
                .run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            const obj = {
                Phone       : null,
                Email       : null,
                NewPassword : request.body.NewPassword,
                TenantId    : request.body.TenantId ?? null,
                TenantCode  : request.body.TenantCode ?? null,
            };

            if (typeof request.body.Phone !== 'undefined') {
                obj.Phone = request.body.Phone;
            }
            if (typeof request.body.Email !== 'undefined') {
                obj.Email = request.body.Email;
            }

            return obj;
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    static generateOtp = async (request: express.Request, response: express.Response): Promise<any> => {
        try {

            await oneOf([
                body('Phone').optional()
                    .trim()
                    .escape(),
                body('Email').optional()
                    .trim()
                    .escape(),
                body('UserId').optional()
                    .isUUID()
                    .trim()
                    .escape(),
            ]).run(request);

            // await oneOf([
            //     body('TenantId').exists()
            //         .trim()
            //         .isUUID(),
            //     body('TenantCode').exists()
            //         .trim()
            //         .escape(),
            // ]).run(request);

            await body('Purpose').optional()
                .trim()
                .run(request);

            await body('RoleId').exists()
                .trim()
                .toInt()
                .run(request);

            const result = validationResult(request);

            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            const obj = {
                Phone      : null,
                Email      : null,
                UserId     : null,
                Purpose    : 'Login',
                RoleId     : request.body.RoleId,
                TenantId   : request.body.TenantId ?? null,
                TenantCode : request.body.TenantCode ?? null,
            };

            if (typeof request.body.Phone !== 'undefined') {
                obj.Phone = request.body.Phone;
            }
            if (typeof request.body.Email !== 'undefined') {
                obj.Email = request.body.Email;
            }
            if (typeof request.body.UserId !== 'undefined') {
                obj.UserId = request.body.UserId;
            }
            if (typeof request.body.Purpose !== 'undefined') {
                obj.Purpose = request.body.Purpose;
            }
            if (typeof request.body.RoleId !== 'undefined') {
                obj.RoleId = request.body.RoleId;
            }

            return obj;

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    static loginWithOtp = async (request: express.Request, response: express.Response): Promise<UserLoginDetails> => {
        try {

            await oneOf([
                body('Phone').optional()
                    .trim()
                    .isLength({ min: 9, max: 10 })
                    .escape(),
                body('Email').optional()
                    .trim()
                    .isEmail()
                    .escape(),
            ]).run(request);

            await body('Otp').exists()
                .trim()
                .isNumeric()
                .isLength({ min: 6, max: 6 })
                .run(request);
            await body('LoginRoleId').exists()
                .trim()
                .isNumeric()
                .run(request);

            // await oneOf([
            //     body('TenantId').exists()
            //         .trim()
            //         .isUUID(),
            //     body('TenantCode').exists()
            //         .trim()
            //         .escape(),
            // ]).run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            const loginObject: UserLoginDetails = {
                Phone       : null,
                Email       : null,
                Password    : null,
                Otp         : request.body.Otp,
                LoginRoleId : parseInt(request.body.LoginRoleId),
                TenantId    : request.body.TenantId ?? null,
                TenantCode  : request.body.TenantCode ?? null,
            };
            if (typeof request.body.Phone !== 'undefined') {
                loginObject.Phone = request.body.Phone;
            }
            if (typeof request.body.Email !== 'undefined') {
                loginObject.Email = request.body.Email;
            }
            return loginObject;
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
