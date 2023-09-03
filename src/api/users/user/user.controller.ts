import express from 'express';
import { UserDeviceDetailsService } from '../../../services/users/user/user.device.details.service';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { UserDetailsDto } from '../../../domain.types/users/user/user.dto';
import { UserService } from '../../../services/users/user/user.service';
import { Loader } from '../../../startup/loader';
import { UserValidator } from './user.validator';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController {

    //#region member variables and constructors

    _service: UserService = null;

    _authorizer: Authorizer = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    constructor() {
        this._service = Loader.container.resolve(UserService);
        this._authorizer = Loader.authorizer;
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
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

    getByPhoneAndRole = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.GetByPhoneAndRole';

            const model = await UserValidator.userExistsCheck(request);
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
            request.context = 'User.GetByEmailAndRole';

            const model = await UserValidator.userExistsCheck(request);
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
            request.context = 'User.LoginWithPassword';

            const loginObject = await UserValidator.loginWithPassword(request, response);
            const userDetails = await this._service.loginWithPassword(loginObject);
            if (userDetails == null) {
                ResponseHandler.failure(request, response, 'User not found!', 404);
                return;
            }

            const user: UserDetailsDto = userDetails.user;
            const accessToken = userDetails.accessToken;
            const refreshToken = userDetails.refreshToken;

            const isProfileComplete = user.Person.FirstName &&
            user.Person.LastName &&
            user.Person.Gender &&
            user.Person.BirthDate ? true : false;

            const message = `User '${user.Person.DisplayName}' logged in successfully!`;
            const data = {
                AccessToken       : accessToken,
                RefreshToken      : refreshToken,
                User              : user,
                RoleId            : user.RoleId,
                IsProfileComplete : isProfileComplete,
                SessionId         : userDetails.sessionId,
                SessionValidTill  : userDetails.sessionValidTill
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
                GenerateOTPResult : entity,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    loginWithOtp = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.LoginWithOtp';

            const loginObject = await UserValidator.loginWithOtp(request, response);
            const userDetails = await this._service.loginWithOtp(loginObject);
            if (userDetails == null) {
                ResponseHandler.failure(request, response, 'User not found!', 404);
                return;
            }

            const user: UserDetailsDto = userDetails.user;
            const accessToken = userDetails.accessToken;
            const refreshToken = userDetails.refreshToken;

            const isProfileComplete = user.Person.FirstName &&
                                      user.Person.LastName &&
                                      user.Person.Gender &&
                                      user.Person.BirthDate ? true : false;
            const data = {
                AccessToken       : accessToken,
                RefreshToken      : refreshToken,
                User              : user,
                RoleId            : user.RoleId,
                IsProfileComplete : isProfileComplete,
                SessionId         : userDetails.sessionId,
                SessionValidTill  : userDetails.sessionValidTill
            };

            const message = `User '${user.Person.DisplayName}' logged in successfully!`;

            ResponseHandler.success(request, response, message, 200, data, true);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    logout = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            request.context = 'User.Logout';

            const sesssionId = request.currentUser.SessionId;
            const userId = request.currentUser.UserId;

            var deviceToken = await UserValidator.logoutToken(request);

            if (!sesssionId) {
                return true;
            }
            var invalidated = await this._service.invalidateSession(sesssionId);

            if (invalidated) {
                Logger.instance().log(`Session invalidated successfully!`);
            }

            var filter = {
                UserId : userId,
                Token  : deviceToken
            };

            var deviceDetails = await this._userDeviceDetailsService.search(filter);

            if (deviceDetails.Items.length > 0) {
                for await (var d of deviceDetails.Items) {
                    await this._userDeviceDetailsService.delete(d.id);
                }
            }

            ResponseHandler.success(request, response, 'User logged out successfully!', 200);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    rotateUserAccessToken = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.RotateUserAccessToken';

            const refreshToken = request.params.refreshToken;
            const accessToken = await this._service.rotateUserAccessToken(refreshToken);

            ResponseHandler.success(request, response, 'User access token rotated successfully!', 200, {
                AccessToken : accessToken,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
