import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';
import { ResponseHandler } from '../../common/response.handler';
import { Helper } from '../../common/helper';
import { UserSearchFilters, UserLoginDetails } from '../../data/domain.types/user.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserInputValidator {

        static getById = async (request: express.Request, response: express.Response): Promise<string> => {
            await param('id').trim().escape().isUUID().run(request);
            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }
            return request.params.id;
        };

        static search = async (
            request: express.Request,
            response: express.Response
        ): Promise<UserSearchFilters> => {
            try {
                await query('phone').optional().trim().escape().run(request);
                await query('email').optional().trim().escape().run(request);
                await query('userId').optional().isUUID().trim().escape().run(request);
                await query('name').optional().trim().escape().run(request);
                await query('gender').optional().isAlpha().trim().escape().run(request);
                await query('birthdateFrom').optional().isDate().trim().escape().run(request);
                await query('birthdateTo').optional().isDate().trim().escape().run(request);
                await query('createdDateFrom').optional().isDate().trim().escape().run(request);
                await query('createdDateTo').optional().isDate().trim().escape().run(request);
                await query('orderBy').optional().trim().escape().run(request);
                await query('order').optional().trim().escape().run(request);
                await query('pageIndex').optional().isInt().trim().escape().run(request);
                await query('itemsPerPage').optional().isInt().trim().escape().run(request);

                await query('full').optional().isBoolean().run(request);

                const result = validationResult(request);
                if (!result.isEmpty()) {
                    Helper.handleValidationError(result);
                }

                return UserInputValidator.getFilter(request);
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        };

        private static getFilter(request): UserSearchFilters {
            var pageIndex = request.query.pageIndex != 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
            var itemsPerPage = request.query.itemsPerPage != 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;
            var filters: UserSearchFilters = {
                Phone: request.query.phone ?? null,
                Email: request.query.email ?? null,
                UserId: request.query.userId ?? null,
                Name: request.query.name ?? null,
                Gender: request.query.gender ?? null,
                BirthdateFrom: request.query.birthdateFrom ?? null,
                BirthdateTo: request.query.birthdateTo ?? null,
                CreatedDateFrom: request.query.createdDateFrom ?? null,
                CreatedDateTo: request.query.createdDateTo ?? null,
                OrderBy: request.query.orderBy ?? 'CreateAt',
                Order: request.query.order ?? 'descending',
                PageIndex: pageIndex,
                ItemsPerPage: itemsPerPage,
            };
            return filters;
        }

        static loginWithPassword = async (
            request: express.Request,
            response: express.Response
        ): Promise<UserLoginDetails> => {
            try {
                await oneOf([
                    body('Phone').optional().trim().escape(),
                    body('Email').optional().trim().escape(),
                ]).run(request);
                await body('Password').exists().trim().run(request);
                await body('LoginRoleId').exists().trim().isNumeric().run(request);

                const result = validationResult(request);
                if (!result.isEmpty()) {
                    Helper.handleValidationError(result);
                }

                var loginObject: UserLoginDetails = {
                    Phone: null,
                    Email: null,
                    Password: request.body.Password,
                    Otp: null,
                    LoginRoleId: request.body.LoginRoleId,
                };
                if (typeof request.body.Phone != 'undefined') {
                    loginObject.Phone = request.body.Phone;
                }
                if (typeof request.body.Email != 'undefined') {
                    loginObject.Email = request.body.Email;
                }
                return loginObject;
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        };

        static resetPassword = async (request: express.Request, response: express.Response): Promise<any> => {
            try {
                await oneOf([
                    body('Phone').optional().trim().escape(),
                    body('Email').optional().trim().escape(),
                ]).run(request);
                await body('NewPassword').exists().trim().run(request);

                const result = validationResult(request);
                if (!result.isEmpty()) {
                    Helper.handleValidationError(result);
                }

                var obj = {
                    Phone: null,
                    Email: null,
                    NewPassword: request.body.NewPassword,
                };

                if (typeof request.body.Phone != 'undefined') {
                    obj.Phone = request.body.Phone;
                }
                if (typeof request.body.Email != 'undefined') {
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
                    body('Phone').optional().trim().escape(),
                    body('Email').optional().trim().escape(),
                    body('UserId').optional().isUUID().trim().escape(),
                ]).run(request);
                await body('Purpose').optional().trim().run(request);

                const result = validationResult(request);
                if (!result.isEmpty()) {
                    Helper.handleValidationError(result);
                }

                var obj = {
                    Phone: null,
                    Email: null,
                    UserId: null,
                    Purpose: 'Login',
                };

                if (typeof request.body.Phone != 'undefined') {
                    obj.Phone = request.body.Phone;
                }
                if (typeof request.body.Email != 'undefined') {
                    obj.Email = request.body.Email;
                }
                if (typeof request.body.UserId != 'undefined') {
                    obj.UserId = request.body.UserId;
                }
                if (typeof request.body.Purpose != 'undefined') {
                    obj.Purpose = request.body.Purpose;
                }

                return obj;
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        };

        static loginWithOtp = async (request: express.Request, response: express.Response): Promise<UserLoginDetails> => {
            try {
                await oneOf([
                    body('Phone').optional().trim().isLength({ min: 10 }).escape(),
                    body('Email').optional().trim().isEmail().escape(),
                ]).run(request);
                await body('Otp').exists().trim().isNumeric().isLength({ min: 6, max: 6 }).run(request);
                await body('LoginRoleId').exists().trim().isNumeric().run(request);

                const result = validationResult(request);
                if (!result.isEmpty()) {
                    Helper.handleValidationError(result);
                }

                var loginObject: UserLoginDetails = {
                    Phone: null,
                    Email: null,
                    Password: null,
                    Otp: request.body.Otp,
                    LoginRoleId: request.body.LoginRoleId,
                };
                if (typeof request.body.Phone != 'undefined') {
                    loginObject.Phone = request.body.Phone;
                }
                if (typeof request.body.Email != 'undefined') {
                    loginObject.Email = request.body.Email;
                }
                return loginObject;
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        };
    };

