import express from 'express';
import { Authorizer } from '../../../../src/auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { UserDetailsDto } from '../../../domain.types/user/user/user.dto';
import { UserService } from '../../../services/user/user.service';
import { Loader } from '../../../startup/loader';
import { UserValidator } from '../../validators/user/user.validator';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController extends BaseController {

    //#region member variables and constructors

    _service: UserService = null;

    _validator: UserValidator = new UserValidator();

    _authorizer: Authorizer = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(UserService);
        this._authorizer = Loader.authorizer;
    
    }

    //#endregion

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('User.GetById', request, response, false);
           
            const id: string = await this._validator.getParamUuid(request, 'id');
            const user = await this._service.getById(id);
            if (user == null) {
                ResponseHandler.failure(request, response, 'User not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                user : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getByPhoneAndRole = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('User.GetByPhoneAndRole', request, response, false);
            const model = await this._validator.userExistsCheck(request);
            const user = await this._service.getByPhoneAndRole(model.Phone, model.RoleId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                User : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getByEmailAndRole = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('User.GetByEmailAndRole', request, response, false);
            const model = await this._validator.userExistsCheck(request);
            const user = await this._service.getByEmailAndRole(model.Email, model.RoleId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                User : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    loginWithPassword = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('User.LoginWithPassword', request, response, false);
            const loginObject = await this._validator.loginWithPassword(request, response);
            const userDetails = await this._service.loginWithPassword(loginObject);
            if (userDetails == null) {
                ResponseHandler.failure(request, response, 'User not found!', 404);
                return;
            }

            const user: UserDetailsDto = userDetails.user;
            const accessToken = userDetails.accessToken;
            const message = `User '${user.Person.DisplayName}' logged in successfully!`;
            const data = {
                AccessToken : accessToken,
                User        : user,
            };

            ResponseHandler.success(request, response, message, 200, data, true);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    generateOtp = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('User.GenerateOtp', request, response, false);
            const obj = await this._validator.generateOtp(request, response);
            const entity = await this._service.generateOtp(obj);
            ResponseHandler.success(request, response, 'OTP has been successfully generated!', 200, {
                GenerateOTPResult : entity,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    loginWithOtp = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('User.LoginWithOtp', request, response, false);
            const loginObject = await this._validator.loginWithOtp(request, response);
            const userDetails = await this._service.loginWithOtp(loginObject);
            if (userDetails == null) {
                ResponseHandler.failure(request, response, 'User not found!', 404);
                return;
            }

            const user: UserDetailsDto = userDetails.user;
            const accessToken = userDetails.accessToken;

            const isProfileComplete = user.Person.FirstName &&
                                      user.Person.LastName &&
                                      user.Person.Gender &&
                                      user.Person.BirthDate ? true : false;
            const data = {
                AccessToken       : accessToken,
                User              : user,
                RoleId            : user.RoleId,
                IsProfileComplete : isProfileComplete
            };

            const message = `User '${user.Person.DisplayName}' logged in successfully!`;

            ResponseHandler.success(request, response, message, 200, data, true);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
}
