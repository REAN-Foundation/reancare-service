import express from 'express';
import { body, oneOf, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { UserExistanceModel, UserLoginDetails } from '../../../domain.types/users/user/user.domain.model';
import { UserSearchFilters } from '../../../domain.types/users/user/user.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserValidator {

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

    private static getFilter(request): UserSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: UserSearchFilters = {
            Phone           : request.query.phone ?? null,
            Email           : request.query.email ?? null,
            UserId          : request.query.userId ?? null,
            Name            : request.query.name ?? null,
            Gender          : request.query.gender ?? null,
            BirthdateFrom   : request.query.birthdateFrom ?? null,
            BirthdateTo     : request.query.birthdateTo ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null,
            OrderBy         : request.query.orderBy ?? 'CreatedAt',
            Order           : request.query.order ?? 'descending',
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
                LoginRoleId : parseInt(request.body.LoginRoleId, 10)
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

        await param('roleId').exists()
            .trim()
            .isNumeric()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        const userDetails: UserExistanceModel = {
            Phone  : null,
            Email  : null,
            RoleId : parseInt(request.params.roleId, 10)
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
                Phone   : null,
                Email   : null,
                UserId  : null,
                Purpose : 'Login',
                RoleId  : request.body.RoleId
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
