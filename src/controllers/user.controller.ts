import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';

import { UserService } from '../services/user.service';
import { Helper } from '../common/helper';
import { ResponseHandler } from '../common/response.handler';
import { Loader } from '../startup/loader';
import { Authorizer } from '../auth/authorizer';
import { Number } from 'aws-sdk/clients/iot';
import { String } from 'aws-sdk/clients/appstream';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController {

    //#region member variables and constructors

    _service: UserService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = new UserService();
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region getById

    getById = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            request.context = 'User.GetById';
            if(!this._authorizer.authorize(request, response)) {
                return false;
            }
            var id: string = await this.sanitizeInput_getById(request, response);
            const user = await this._service.getById(id);
            if(user == null) {
                ResponseHandler.failure(request, response, 'User not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                user: user,
            });
        } 
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private async sanitizeInput_getById(request: express.Request, response: express.Response): Promise<string> {

        await param('id')
            .trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.params.id;
    }

    //#endregion

    //#region search

    search = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            request.context = 'User.Search';
            if(!this._authorizer.authorize(request, response)) {
                return false;
            }
            var filters = this.sanitizeInput_search(request, response);
            const users = await this._service.search(filters);
            if(users != null) {
                var count = users.length;
                var message = count == 0 ? 'No records found!' : `Total ${count} user records retrieved successfully!`;
                ResponseHandler.success(request, response, message, 200, {
                    users: users,
                });
                return;
            }
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sanitizeInput_search = async (
        request: express.Request,
        response: express.Response
    ): Promise<any> => {

        try {

            await query('phone')
                .optional()
                .trim()
                .escape()
                .run(request);

            await query('email')
                .optional()
                .trim()
                .escape()
                .run(request);

            await query('userId')
                .optional()
                .isUUID()
                .trim()
                .escape()
                .run(request);

            await query('name')
                .optional()
                .trim()
                .escape()
                .run(request);

            await query('gender')
                .optional()
                .isAlpha()
                .trim()
                .escape()
                .run(request);

            await query('birthdateFrom')
                .optional()
                .isDate()
                .trim()
                .escape()
                .run(request);

            await query('birthdateTo')
                .optional()
                .isDate()
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

            await query('orderBy')
                .optional()
                .trim()
                .escape()
                .run(request);

            await query('order')
                .optional()
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

            var filters = {
                phone: null,
                email: null,
                userId: null,
                name: null,
                gender: null,
                birthdateFrom: null,
                birthdateTo: null,
                createdDateFrom: null,
                createdDateTo: null,
                orderBy: 'CreateAt',
                order: 'descending',
                pageIndex: 0,
                itemsPerPage: 25
            };

            if(typeof request.query.phone != 'undefined') {
                filters.phone = request.query.phone;
            }
            if(typeof request.query.email != 'undefined') {
                filters.email = request.query.email;
            }
            if(typeof request.query.userId != 'undefined') {
                filters.userId = request.query.userId;
            }
            if(typeof request.query.name != 'undefined') {
                filters.name = request.query.name;
            }
            if(typeof request.query.gender != 'undefined') {
                filters.gender = request.query.gender;
            }
            if(typeof request.query.birthdateFrom != 'undefined') {
                filters.birthdateFrom = request.query.birthdateFrom;
            }
            if(typeof request.query.birthdateTo != 'undefined') {
                filters.birthdateTo = request.query.birthdateTo;
            }
            if(typeof request.query.createdDateFrom != 'undefined') {
                filters.createdDateFrom = request.query.createdDateFrom;
            }
            if(typeof request.query.createdDateTo != 'undefined') {
                filters.createdDateTo = request.query.createdDateTo;
            }
            if(typeof request.query.orderBy != 'undefined') {
                filters.orderBy = request.query.orderBy as string;
            }
            if(typeof request.query.order != 'undefined') {
                filters.order = request.query.order as string;
            }
            if(typeof request.query.pageIndex != 'undefined') {
                filters.pageIndex = parseInt(request.query.pageIndex as String, 10);
            }
            if(typeof request.query.itemsPerPage != 'undefined') {
                filters.itemsPerPage = parseInt(request.query.itemsPerPage as String, 10);
            }

            return filters;

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region loginWithPassword

    loginWithPassword = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            request.context = 'User.LoginWithPassword';

            var loginObject = this.sanitizeInput_loginWithPassword(request, response);
            var userDetails = await this._service.loginWithPassword(loginObject);
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
    
            var firstName = (user.FirstName != null) ? user.FirstName: '';
            var lastName = (user.LastName != null) ? user.LastName: '';
            var name =  firstName + ' ' + lastName;
    
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
    
            ResponseHandler.success(request, response, `User \'' ${name}+ '\' logged in successfully!`, 200,
                {
                    accessToken: accessToken,
                    user: entity
                }, false);
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sanitizeInput_loginWithPassword = async (
        request: express.Request,
        response: express.Response
    ): Promise<any> => {

        try {
            await oneOf([
                body('Phone').optional().trim().escape(),
                body('Email').optional().trim().escape()
            ])
            .run(request);
        
            await body('Password')
                .exists()
                .trim()
                .run(request);

            await query('birthdateTo')
                .optional()
                .isDate()
                .trim()
                .escape()
                .run(request);

            var obj = {
                phone: null,
                email: null,
                password: request.body.Password
            };

            if(typeof request.body.Phone != 'undefined') {
                obj.phone = request.body.Phone;
            }
            if(typeof request.body.Email != 'undefined') {
                obj.email = request.body.Email;
            }

            return obj;

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region resetPassword

    resetPassword = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            
            request.context = 'User.ResetPassword';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var obj = this.sanitizeInput_resetPassword(request, response);
            var details = await this._service.resetPassword(obj);
            if (details == null) {
                ResponseHandler.failure(request, response, 'Unable to reset password!', 404);
                return;
            }
            ResponseHandler.success(request, response, `Password reset successfully!`, 200, { details: details });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sanitizeInput_resetPassword = async (
        request: express.Request,
        response: express.Response
    ): Promise<any> => {

        try {
            await oneOf([
                body('Phone').optional().trim().escape(),
                body('Email').optional().trim().escape()
            ])
                .run(request);

            await body('NewPassword')
                .exists()
                .trim()
                .run(request);

            var obj = {
                phone: null,
                email: null,
                newPassword: request.body.NewPassword
            };

            if (typeof request.body.Phone != 'undefined') {
                obj.phone = request.body.Phone;
            }
            if (typeof request.body.Email != 'undefined') {
                obj.email = request.body.Email;
            }

            return obj;

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region generateOtp

    generateOtp = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            request.context = 'User.GenerateOtp';
            var obj = this.sanitizeInput_generateOtp(request, response);
            var entity = await this._service.generateOtp(obj);
            ResponseHandler.success(request, response, 'OTP has been successfully generated!', 200, { entity: entity });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sanitizeInput_generateOtp = async (
        request: express.Request,
        response: express.Response
    ): Promise<any> => {

        try {
            await oneOf([
                    body('Phone').optional().trim().escape(),
                    body('Email').optional().trim().escape(),
                    body('UserId').optional().isUUID().trim().escape(),
                ])
                .run(request);

            await body('Purpose')
                .optional()
                .trim()
                .run(request);

            var obj = {
                Phone: null,
                Email: null,
                UserId: null,
                Purpose: 'Login'
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

    //#endregion

    //#region loginWithOtp

    loginWithOtp = async (
        request: express.Request,
        response: express.Response
    ) => {};

    //#endregion

    //#region common

    private async sanitizeUserQuery(request) {


        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    //#endregion
};