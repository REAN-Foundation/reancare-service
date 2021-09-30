import express from 'express';

import { UserService } from '../../services/user.service';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { UserDetailsDto } from '../../domain.types/user/user.dto';
import { UserValidator } from '../validators/user.validator';

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

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.GetById';
            await this._authorizer.authorize(request, response);

            const id: string = await UserValidator.getById(request);
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

    loginWithPassword = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.LoginWithPassword';

            const loginObject = await UserValidator.loginWithPassword(request, response);
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
            request.context = 'User.GenerateOtp';

            const obj = await UserValidator.generateOtp(request, response);
            const entity = await this._service.generateOtp(obj);
            ResponseHandler.success(request, response, 'OTP has been successfully generated!', 200, {
                entity : entity,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    loginWithOtp = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.LoginWithPassword';

            const loginObject = await UserValidator.loginWithOtp(request, response);
            const userDetails = await this._service.loginWithOtp(loginObject);
            if (userDetails == null) {
                ResponseHandler.failure(request, response, 'User not found!', 404);
                return;
            }

            const user: UserDetailsDto = userDetails.user;
            const accessToken = userDetails.accessToken;

            const isProfileComplete = user.Person.FirstName && user.Person.LastName &&
                                      user.Person.Gender && user.Person.BirthDate;
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
