import express from 'express';
import { UserDeviceDetailsService } from '../../../services/users/user/user.device.details.service';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { UserDetailsDto } from '../../../domain.types/users/user/user.dto';
import { UserService } from '../../../services/users/user/user.service';
import { PersonService } from '../../../services/person/person.service';
import { UserValidator } from './user.validator';
import { Logger } from '../../../common/logger';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import { 
    ResetPasswordModel, 
    ChangePasswordModel, 
    UserDomainModel, 
    UserBasicDetails
} from '../../../domain.types/users/user/user.domain.model';
import { PersonDetailsDto } from '../../../domain.types/person/person.dto';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController extends BaseController {

    //#region member variables and constructors

    _service: UserService = Injector.Container.resolve(UserService);

    _personService = Injector.Container.resolve(PersonService);

    _userDeviceDetailsService: UserDeviceDetailsService = Injector.Container.resolve(UserDeviceDetailsService);

    constructor() {
        super();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: UserDomainModel = await UserValidator.create(request);

            let person: PersonDetailsDto = null;
            let user: UserDetailsDto = null;

            const basicDetails: UserBasicDetails = {
                Phone      : model.Person.Phone,
                Email      : model.Person.Email,
                UserName   : model.UserName,
                TenantId   : model.TenantId,
                TenantCode : model.TenantCode,
            };

            const existingUser = await this._service.getUserDetails(basicDetails);
            if (existingUser) {
                const existingUserRole = existingUser.RoleId;
                const existingUserTenantId = existingUser.TenantId;
                if (existingUserRole === model.RoleId && existingUserTenantId === model.TenantId) {
                    throw new ApiError(409, 'User already exists');
                }
            }
            person = existingUser?.Person;
            if (person == null) {
                person = await this._personService.create(model.Person);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }

            model.Person.id = person.id;

            user = await this._service.create(model);
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
            await this.authorizeOne(request, user.id, user.TenantId);
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                user : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId = request.params.id;
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, userId, user.TenantId);

            const model = await UserValidator.update(request);

            let updatedUser = await this._service.update(userId, model);
            if (user == null) {
                throw new ApiError(400, 'Cannot update user!');
            }

            const personModel = model.Person;
            const person = await this._personService.update(user.PersonId, personModel);
            if (person == null) {
                throw new ApiError(400, 'Cannot update person!');
            }

            updatedUser = await this._service.getById(userId);
            ResponseHandler.success(request, response, 'User updated successfully!', 200, {
                User : updatedUser,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId = request.params.id;
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, userId, user.TenantId);

            const personId = user.PersonId;
            const userDeleted = await this._service.delete(userId);
            if (userDeleted == null) {
                throw new ApiError(400, 'Cannot delete user!');
            }
            const personDeleted = await this._personService.delete(personId);
            if (personDeleted == null) {
                throw new ApiError(400, 'Cannot delete person!');
            }
            ResponseHandler.success(request, response, 'User deleted successfully!', 200, {
                Deleted : userDeleted && personDeleted,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const searchParams = await UserValidator.search(request);
            const users = await this._service.search(searchParams);
            ResponseHandler.success(request, response, 'Users retrieved successfully!', 200, {
                Users : users,
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

    loginWithPassword = async (request: express.Request, response: express.Response): Promise<void> => {
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
    };

    changePassword = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: ChangePasswordModel = await UserValidator.changePassword(request);
            const result = await this._service.changePassword(model);
            ResponseHandler.success(request, response, 'Password changed successfully!', 200, {
                PasswordReset : result,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    resetPassword = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: ResetPasswordModel = await UserValidator.resetPassword(request);
            const result = await this._service.resetPassword(model);
            ResponseHandler.success(request, response, 'Password reset successfully!', 200, {
                PasswordReset : result,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendPasswordResetCode = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await UserValidator.sendPasswordResetCode(request);
            const result = await this._service.sendPasswordResetCode(model);
            ResponseHandler.success(request, response, 'Password reset email sent successfully!', 200, {
                SendPasswordResetEmailResult : result,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

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
