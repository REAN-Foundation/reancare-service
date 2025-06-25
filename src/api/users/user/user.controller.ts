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
    UserBasicDetails,
    UserLoginDetails,
    UserAccountActionResult
} from '../../../domain.types/users/user/user.domain.model';
import { PersonDetailsDto } from '../../../domain.types/person/person.dto';
import { UserHelper } from '../user.helper';
import { RoleService } from '../../../services/role/role.service';
import { UserEvents } from './user.events';
import { ActivityTrackerHandler } from '../../../services/users/patient/activity.tracker/activity.tracker.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController extends BaseController {

    //#region member variables and constructors

    _service: UserService = Injector.Container.resolve(UserService);

    _personService = Injector.Container.resolve(PersonService);

    _roleService = Injector.Container.resolve(RoleService);

    _userDeviceDetailsService: UserDeviceDetailsService = Injector.Container.resolve(UserDeviceDetailsService);

    _userHelper: UserHelper = new UserHelper();

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

            await this._userHelper.performDuplicatePersonCheck(basicDetails.Phone, basicDetails.Email);

            const existingPerson = await this._service.getExistingPerson(basicDetails);
            if (existingPerson == null) {
                person = await this._personService.create(model.Person);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }
            else {
                person = existingPerson;
                var existingUserWithRole = await this._service.getUserByPersonIdAndRole(existingPerson.id, model.RoleId);
                if (existingUserWithRole) {
                    throw new ApiError(409, `User already exists with the same role.`);
                }
                await this._userHelper.checkMultipleAdministrativeRoles(model.RoleId, existingPerson.id);
            }

            model.Person.id = person.id;

            const updatedPerson = await this._userHelper.updatePersonInformation(person, model);

            if (!updatedPerson) {
                throw new ApiError(409, `User already exists with the same email.`);
            }

            if (!model.UserName) {
                model.UserName = await this._service.generateUserName(model.Person.FirstName, model.Person.LastName);
            }

            user = await this._service.create(model);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }

            UserEvents.onUserCreated(request, user);

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

            const model: UserDomainModel = await UserValidator.update(request);
            
            if (model.Person.Phone && (user.Person.Phone !== model.Person.Phone)) {
                const isPersonExistsWithPhone = await this._personService.getPersonWithPhone(model.Person.Phone);
                if (isPersonExistsWithPhone) {
                    throw new ApiError(409, `Person already exists with the phone ${model.Person.Phone}`);
                }
            }

            if (model.Person.Email && (user.Person.Email !== model.Person.Email)) {
                const isPersonExistsWithEmail = await this._personService.getPersonWithEmail(model.Person.Email);
                if (isPersonExistsWithEmail) {
                    throw new ApiError(409, `Person already exists with the email ${model.Person.Email}`);
                }
            }

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

            UserEvents.onUserUpdated(request, updatedUser);

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
            const personId = user.PersonId;
            await this.authorizeOne(request, userId, user.TenantId);

            const userDeleted = await this._service.delete(userId);
            if (userDeleted == null) {
                throw new ApiError(400, 'Cannot delete user!');
            }

            const personDeleted = await this._personService.delete(personId);
            if (personDeleted == null) {
                Logger.instance().log(`Cannot delete person!`);
            }

            UserEvents.onUserDeleted(request, user);

            ResponseHandler.success(request, response, 'User deleted successfully!', 200, {
                Deleted : userDeleted,
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
            const loginObject: UserLoginDetails = await UserValidator.loginWithPassword(request, response);
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

            UserEvents.onUserLoginWithPassword(request, user);

            ResponseHandler.success(request, response, message, 200, data, true);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    changePassword = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: ChangePasswordModel = await UserValidator.changePassword(request);
            const result: UserAccountActionResult = await this._service.changePassword(model);

            const user = result.User;
            UserEvents.onUserPasswordChanged(request, user);

            ResponseHandler.success(request, response, 'Password changed successfully!', 200, {
                PasswordReset : result.Success,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    resetPassword = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: ResetPasswordModel = await UserValidator.resetPassword(request);
            const result: UserAccountActionResult = await this._service.resetPassword(model);

            const user = result.User;
            UserEvents.onUserPasswordReset(request, user);

            ResponseHandler.success(request, response, 'Password reset successfully!', 200, {
                PasswordReset : result.Success,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendPasswordResetCode = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await UserValidator.sendPasswordResetCode(request);
            const result: UserAccountActionResult = await this._service.sendPasswordResetCode(model);

            const user = result.User;
            UserEvents.onSendPasswordResetCode(request, user);

            ResponseHandler.success(request, response, 'Password reset code sent successfully!', 200, {
                SendPasswordResetEmailResult : result.Success,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    generateOtp = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const obj = await UserValidator.generateOtp(request, response);
            await this._userHelper.performDuplicatePersonCheck(obj.Phone, obj.Email);
            const result: UserAccountActionResult = await this._service.generateOtp(obj);

            const user = result.User;
            UserEvents.onGenerateOtp(request, user);

            ResponseHandler.success(request, response, 'OTP has been successfully generated!', 200, {
                GenerateOTPResult : result.Success,
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

            UserEvents.onUserLoginWithOtp(request, user);

            ActivityTrackerHandler.addOrUpdateActivity({
                PatientUserId      : user.id,
                RecentActivityDate : new Date(),
            });
            ResponseHandler.success(request, response, message, 200, data, true);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    logout = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            const sesssionId = request.currentUser.SessionId;
            const userId = request.currentUser.UserId;

            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }

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

            UserEvents.onUserLogout(request, user);

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

    deleteProfileImage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId = request.params.id;
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, userId, user.TenantId);
            const model: UserDomainModel = await UserValidator.update(request);
            const personModel = model.Person;
            const updatedUser = await this._personService.deleteProfileImage(user.PersonId, personModel);
            if (updatedUser == null) {
                throw new ApiError(400, 'Cannot update user!');
            }
            ResponseHandler.success(request, response, 'User profile image deleted successfully!', 200, {
                User : updatedUser,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    validateUserById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await UserValidator.getById(request);
            const user = await this._service.getById(id);
            if (user == null) {
                ResponseHandler.failure(request, response, 'User not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                success : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
