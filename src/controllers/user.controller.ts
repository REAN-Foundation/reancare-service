import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';

import { UserService } from '../services/user.service';
import { Helper } from '../common/helper';
import { ResponseHandler } from '../common/response.handler';
import { Loader } from '../startup/loader';
import { Authorizer } from '../auth/authorizer';
import { String } from 'aws-sdk/clients/appstream';
import { UserSearchFilters, UserDTO, UserLoginRequestDTO } from '../data/domain.types/user.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController {
    //#region member variables and constructors

    _service: UserService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(UserService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    getById = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'User.GetById';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var id: string = await UserController.Sanitizer.getById(request, response);
            const user = await this._service.getById(id);
            if (user == null) {
                ResponseHandler.failure(request, response, 'User not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                user: user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'User.Search';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var filters = await UserController.Sanitizer.search(request, response);

            var extractFull: boolean =
                request.query.full != 'undefined' && typeof request.query.full == 'boolean'
                    ? request.query.full
                    : false;

            const users = await this._service.search(filters, extractFull);
            if (users != null) {
                var count = users.length;
                var message =
                    count == 0 ? 'No records found!' : `Total ${count} user records retrieved successfully!`;
                ResponseHandler.success(request, response, message, 200, {
                    users: users,
                });
                return;
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    loginWithPassword = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'User.LoginWithPassword';

            var loginObject = await UserController.Sanitizer.loginWithPassword(request, response);
            var userDetails = await this._service.loginWithPassword(loginObject);
            if (userDetails == null) {
                ResponseHandler.failure(request, response, 'User not found!', 404);
                return;
            }

            var user: UserDTO = userDetails.UserDTO;
            var accessToken = userDetails.AccessToken;

            ResponseHandler.success(
                request,
                response,
                `User \'' ${user.DisplayName}+ '\' logged in successfully!`,
                200,
                {
                    accessToken: accessToken,
                    user: user,
                },
                false
            );
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    // resetPassword = async (request: express.Request, response: express.Response) => {
    //     try {
    //         request.context = 'User.ResetPassword';
    //         if (!this._authorizer.authorize(request, response)) {
    //             return false;
    //         }
    //         var obj = UserController.Sanitizer.resetPassword(request, response);
    //         var details = await this._service.resetPassword(obj);
    //         if (details == null) {
    //             ResponseHandler.failure(request, response, 'Unable to reset password!', 404);
    //             return;
    //         }
    //         ResponseHandler.success(request, response, `Password reset successfully!`, 200, {
    //             details: details,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    generateOtp = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'User.GenerateOtp';
            var obj = UserController.Sanitizer.generateOtp(request, response);
            var entity = await this._service.generateOtp(obj);
            ResponseHandler.success(request, response, 'OTP has been successfully generated!', 200, {
                entity: entity,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    loginWithOtp = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'User.LoginWithPassword';

            var loginObject = await UserController.Sanitizer.loginWithOtp(request, response);
            var userDetails = await this._service.loginWithOtp(loginObject);
            if (userDetails == null) {
                ResponseHandler.failure(request, response, 'User not found!', 404);
                return;
            }

            var user = userDetails.user;
            var accessToken = userDetails.accessToken;
            var role = user.Role;
            var roleTableId = user.RoleTableId;

            if (roleTableId == null) {
                ResponseHandler.failure(request, response, 'Login error : user role not found.', 404);
                return;
            }

            var firstName = user.FirstName != null ? user.FirstName : '';
            var lastName = user.LastName != null ? user.LastName : '';
            var name = firstName + ' ' + lastName;

            var entity = {
                UserId: user.id,
                RoleId: user.RoleTableId,
                FirstName: user.FirstName,
                LastName: user.LastName,
                PhoneNumber: user.PhoneNumber,
                Email: user.Email,
                UserName: user.UserName,
                DateCreated: user.created_at,
                DateUpdated: user.updated_at,
            };

            ResponseHandler.success(
                request,
                response,
                `User \'' ${name}+ '\' logged in successfully!`,
                200,
                {
                    accessToken: accessToken,
                    user: entity,
                },
                false
            );
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Internal Sanitizer class

    private static Sanitizer = class {
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

                return UserController.Sanitizer.getFilter(request);
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        };

        private static getFilter(request): UserSearchFilters {
            var pageIndex = request.query.pageIndex != 'undefined' ? parseInt(request.query.pageIndex as String, 10) : 0;
            var itemsPerPage = request.query.itemsPerPage != 'undefined' ? parseInt(request.query.itemsPerPage as String, 10) : 25;
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
        ): Promise<UserLoginRequestDTO> => {
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

                var loginObject: UserLoginRequestDTO = {
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

        static loginWithOtp = async (request: express.Request, response: express.Response): Promise<UserLoginRequestDTO> => {
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

                var loginObject: UserLoginRequestDTO = {
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

    //#endregion
}
