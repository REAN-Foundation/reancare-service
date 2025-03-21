import express from 'express';
import { TenantService } from '../../../services/tenant/tenant.service';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { Injector } from '../../../startup/injector';
import { TenantValidator } from './tenant.validator';
import { ApiError } from '../../../common/api.error';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { RoleService } from '../../../services/role/role.service';
import { PersonService } from '../../../services/person/person.service';
import { UserService } from '../../../services/users/user/user.service';
import { PersonRoleService } from '../../../services/person/person.role.service';
import { Roles } from '../../../domain.types/role/role.types';
import { UserDomainModel } from '../../../domain.types/users/user/user.domain.model';
import { Logger } from '../../../common/logger';
import { EmailService } from "../../../modules/communication/email/email.service";
import { EmailDetails } from "../../../modules/communication/email/email.details";
import { TenantDto } from '../../../domain.types/tenant/tenant.dto';
import { Helper } from '../../../common/helper';
import { TenantSettingsService } from '../../../services/tenant/tenant.settings.service';
import { BaseController } from '../../../api/base.controller';
import { UserHelper } from '../../../api/users/user.helper';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantController extends BaseController {

    //#region member variables and constructors

    _service: TenantService = Injector.Container.resolve(TenantService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _personRoleService: PersonRoleService = Injector.Container.resolve(PersonRoleService);

    _tenantSettingsService: TenantSettingsService = Injector.Container.resolve(TenantSettingsService);

    _validator: TenantValidator = new TenantValidator();

    _userHelper: UserHelper = new UserHelper();

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.createOrUpdate(request, false);
            await this._userHelper.performDuplicatePersonCheck(model.Phone, model.Email);
            if (model.Code === 'default') {
                throw new ApiError(400, 'Cannot create tenant with code "default"!');
            }
            await this.authorizeOne(request);
            const tenant = await this._service.create(model);
            if (tenant == null) {
                throw new ApiError(400, 'Unable to create tenant.');
            }
            const tenantCode = tenant.Code;
            const adminUserName = (tenantCode + '-admin').toLowerCase();
            const adminPassword = Helper.generatePassword();
            const role = await this._roleService.getByName(Roles.TenantAdmin);
            const userModel: UserDomainModel = {
                Person : {
                    Phone     : tenant.Phone,
                    Email     : tenant.Email,
                    FirstName : 'Admin',
                    LastName  : tenant.Name,
                },
                TenantId : tenant.id,
                UserName : adminUserName,
                Password : adminPassword,
                RoleId   : role.id,
            };

            const person = await this._personService.create(userModel.Person);
            userModel.Person.id = person.id;
            const user = await this._userService.create(userModel);
            if (user == null) {
                throw new ApiError(400, 'Unable to create tenant admin user.');
            }
            var personRole = await this._personRoleService.addPersonRole(person.id, role.id);
            if (personRole == null) {
                throw new ApiError(400, 'Unable to assign tenant admin user role.');
            }
            Logger.instance().log(`Tenant admin user created successfully. UserName: ${adminUserName}`);

            const settings = await this._tenantSettingsService.createDefaultSettings(tenant.id);

            //Send email to the admin user with username and password
            await this.sendWelcomeEmail(tenant, adminUserName, adminPassword);

            ResponseHandler.success(request, response, 'Tenant added successfully!', 201, {
                Tenant   : tenant,
                Settings : settings,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            await this.authorizeOne(request, null, tenant.id);
            ResponseHandler.success(request, response, 'Tenant retrieved successfully!', 200, {
                Tenant : tenant,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const currentUserRole = request.currentUser.CurrentRole;
            if (currentUserRole !== Roles.SystemAdmin &&
                currentUserRole !== Roles.SystemUser
            ) {
                throw new ApiError(403, 'Unauthorized action!');
            }
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} tenant records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, {
                TenantRecords : searchResults,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            await this.authorizeOne(request, null, tenant.id);
            if (tenant.Code === 'default') {
                throw new ApiError(400, 'Cannot update tenant with code "default"!');
            }
            const domainModel = await this._validator.createOrUpdate(request, true);
            const updatedTenant = await this._service.update(id, domainModel);
            if (tenant == null) {
                throw new ApiError(400, 'Unable to update tenant record!');
            }
            ResponseHandler.success(request, response, 'Tenant updated successfully!', 200, {
                Tenant : updatedTenant,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            await this.authorizeOne(request, null, tenant.id);
            if (tenant.Code === 'default') {
                throw new ApiError(400, 'Cannot delete tenant with code "default"!');
            }
            const deleted = await this._service.delete(id);
            ResponseHandler.success(request, response, 'Tenant deleted successfully!', 200, {
                Deleted : deleted,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    promoteTenantUserAsAdmin = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            await this.authorizeOne(request, null, tenant.id);
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            const promoted = await this._service.promoteTenantUserAsAdmin(id, userId);
            ResponseHandler.success(request, response, 'User promoted as admin to tenant successfully!', 200, {
                Promoted : promoted,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    demoteAdmin = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            await this.authorizeOne(request, null, tenant.id);
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            const demoted = await this._service.demoteAdmin(id, userId);
            ResponseHandler.success(request, response, 'User demoted as admin from tenant successfully!', 200, {
                Demoted : demoted,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            await this.authorizeOne(request, null, tenant.id);
            const stats = await this._service.getTenantStats(id);
            ResponseHandler.success(request, response, 'Tenant stats retrieved successfully!', 200, {
                Stats : stats,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantAdmins = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            await this.authorizeOne(request, null, tenant.id);
            const admins = await this._service.getTenantAdmins(id);
            ResponseHandler.success(request, response, 'Tenant admins retrieved successfully!', 200, {
                Admins : admins,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantRegularUsers = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            await this.authorizeOne(request, null, tenant.id);
            const moderators = await this._service.getTenantRegularUsers(id);
            ResponseHandler.success(request, response, 'Tenant moderators retrieved successfully!', 200, {
                Moderators : moderators,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private sendWelcomeEmail = async (tenant: TenantDto, adminUserName: string, adminPassword: string) => {
        try {
            const emailService = new EmailService();
            var body = await emailService.getTemplate('tenant.welcome.template.html');

            body = body.replace(/{{PLATFORM_NAME}}/g, process.env.PLATFORM_NAME);
            body = body.replace(/{{PLATFORM_WEBSITE}}/g, process.env.PLATFORM_WEBSITE);
            body = body.replace(/{{PLATFORM_SUPPORT_EMAIL}}/g, process.env.PLATFORM_SUPPORT_EMAIL);
            body = body.replace(/{{TENANT_NAME}}/g, tenant.Name);
            body = body.replace('{{TENANT_ADMIN_USER_NAME}}', adminUserName);
            body = body.replace('{{TENANT_ADMIN_PASSWORD}}', adminPassword);

            const emailDetails: EmailDetails = {
                EmailTo : tenant.Email,
                Subject : `Welcome`,
                Body    : body,
            };
            Logger.instance().log(`Username -> ${adminUserName}`);
            Logger.instance().log(`Password -> ${adminPassword}`);
            Logger.instance().log(`Sending welcome email to ${tenant.Email}`);
            Logger.instance().log(`Email details: ${JSON.stringify(emailDetails)}`);

            const sent = await emailService.sendEmail(emailDetails, false);
            if (!sent) {
                Logger.instance().log(`Unable to send email to ${tenant.Email}`);
            }
        }
        catch (error) {
            Logger.instance().log(`Unable to send email to ${tenant.Email}`);
        }
    };

}
