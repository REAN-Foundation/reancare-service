import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { UserExistanceModel, UserLoginDetails } from '../../../domain.types/user/user/user.domain.model';
import { UserSearchFilters } from '../../../domain.types/user/user/user.search.types';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class UserValidator extends BaseValidator {

    constructor() {
        super();
    }

    getById = async (request: express.Request): Promise<string> => {

        await this.validateUuid(request, 'id', Where.Param, true, false);

        this.validateRequest(request);
        
        return request.params.id;
    };

    search = async (request: express.Request): Promise<UserSearchFilters> => {

        await this.validateString(request, 'phone', Where.Query, false, false);
        await this.validateString(request, 'email', Where.Query, false, true);
        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, true);
        await this.validateString(request, 'gender', Where.Query, false, true);
        await this.validateDate(request, 'birthdateFrom', Where.Query, false, true);
        await this.validateDate(request, 'birthdateTo', Where.Query, false, true);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateString(request, 'orderBy', Where.Query, false, false);
        await this.validateString(request, 'order', Where.Query, false, false);
        await this.validateInt(request, 'pageIndex', Where.Query, false, false);
        await this.validateInt(request, 'itemsPerPage', Where.Query, false, false);
        await this.validateBoolean(request, 'full', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);

    };

    private getFilter(request): UserSearchFilters {

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

    loginWithPassword = async (request: express.Request,response: express.Response): Promise<UserLoginDetails> => {
        try {
            await this.validateString(request, 'Phone', Where.Body, false, false);
            await this.validateString(request, 'Email', Where.Body, false, true);
            await this.validateString(request, 'UserName', Where.Body, false, true);
            await this.validateString(request, 'Password', Where.Body, true, true);
            await this.validateInt(request, 'LoginRoleId', Where.Body, true, false);

            this.validateRequest(request);

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
    
    userExistsCheck = async (request: express.Request): Promise<UserExistanceModel> => {

        await this.validateString(request, 'phone', Where.Param, false, false);
        await this.validateString(request, 'email', Where.Param, false, true);
        await this.validateInt(request, 'roleId', Where.Param, true, false);

        this.validateRequest(request);

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

    resetPassword = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            await this.validateString(request, 'Phone', Where.Body, false, false);
            await this.validateString(request, 'Email', Where.Body, false, true);
            await this.validateString(request, 'NewPassword', Where.Body, true, true);

            this.validateRequest(request);

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

    generateOtp = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            await this.validateString(request, 'Phone', Where.Body, false, false);
            await this.validateString(request, 'Email', Where.Body, false, true);
            await this.validateUuid(request, 'UserId', Where.Body, false, false);
            await this.validateString(request, 'Purpose', Where.Body, false, false);
            await this.validateInt(request, 'RoleId', Where.Body, true, false);

            this.validateRequest(request);

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

    loginWithOtp = async (request: express.Request, response: express.Response): Promise<UserLoginDetails> => {
        try {
            await this.validateString(request, 'Phone', Where.Body, false, false);
            await this.validateString(request, 'Email', Where.Body, false, true);
            await this.validateInt(request, 'Otp', Where.Body, true, false);
            await this.validateInt(request, 'LoginRoleId', Where.Body, true, false);

            this.validateRequest(request);

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

