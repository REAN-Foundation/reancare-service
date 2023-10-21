import express from 'express';
import { UserDeviceDetailsService } from '../../../services/users/user/user.device.details.service';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { UserDetailsDto } from '../../../domain.types/users/user/user.dto';
import { UserService } from '../../../services/users/user/user.service';
import { UserValidator } from './user.validator';
import { Logger } from '../../../common/logger';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController extends BaseController {

    //#region member variables and constructors

    _service: UserService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    constructor() {
        super('User');
        this._service = Loader.container.resolve(UserService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await UserValidator.create(request);
            const user = await this._service.create(domainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            ResponseHandler.success(request, response, 'User created successfully!', 201, {
                User : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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

    getTenantUserByRoleAndPhone = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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

    getTenantUserByRoleAndEmail = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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

    public async loginWithPassword(request: express.Request, response: express.Response): Promise<void> {
        try {
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
    }

    generateOtp = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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
            const refreshToken = request.params.refreshToken;
            const accessToken = await this._service.rotateUserAccessToken(refreshToken);

            ResponseHandler.success(request, response, 'User access token rotated successfully!', 200, {
                AccessToken : accessToken,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantsForUserWithPhone = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = request.params.id;
            const tenants = await this._service.getTenantsForUser(id);
            ResponseHandler.success(request, response, 'User tenants retrieved successfully!', 200, {
                Tenants : tenants,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantsForUserWithEmail = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = request.params.id;
            const tenants = await this._service.getTenantsForUser(id);
            ResponseHandler.success(request, response, 'User tenants retrieved successfully!', 200, {
                Tenants : tenants,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
