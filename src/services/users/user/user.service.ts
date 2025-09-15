import { generate } from 'generate-password';
import { IUserLoginSessionRepo } from '../../../database/repository.interfaces/users/user/user.login.session.repo.interface';
import { inject, injectable } from 'tsyringe';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { Logger } from '../../../common/logger';
import { TimeHelper } from '../../../common/time.helper';
import { ConfigurationManager } from '../../../config/configuration.manager';
import { IInternalTestUserRepo } from '../../../database/repository.interfaces/users/user/internal.test.user.repo.interface';
import { IOtpRepo } from '../../../database/repository.interfaces/users/user/otp.repo.interface';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IPersonRoleRepo } from '../../../database/repository.interfaces/person/person.role.repo.interface';
import { IRoleRepo } from '../../../database/repository.interfaces/role/role.repo.interface';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { CurrentUser } from '../../../domain.types/miscellaneous/current.user';
import { OtpPersistenceEntity } from '../../../domain.types/users/otp/otp.domain.types';
import { PersonDetailsDto } from '../../../domain.types/person/person.dto';
import { Roles } from '../../../domain.types/role/role.types';
import { ChangePasswordModel, OtpGenerationModel, UserAccountActionResult, ResetPasswordModel, SendPasswordResetCodeModel, UserBasicDetails, UserDomainModel, UserLoginDetails } from '../../../domain.types/users/user/user.domain.model';
import { UserDetailsDto } from '../../../domain.types/users/user/user.dto';
import { UserLoginSessionDomainModel } from '../../../domain.types/users/user.login.session/user.login.session.domain.model';
import { DurationType } from '../../../domain.types/miscellaneous/time.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { IUserDeviceDetailsRepo } from '../../../database/repository.interfaces/users/user/user.device.details.repo.interface ';
import { IPatientRepo } from '../../../database/repository.interfaces/users/patient/patient.repo.interface';
import { IAssessmentTemplateRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface';
import { IAssessmentRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface';
import { ITenantRepo } from '../../../database/repository.interfaces/tenant/tenant.repo.interface';
import { IUserTaskRepo } from '../../../database/repository.interfaces/users/user/user.task.repo.interface';
import { TenantDto } from '../../../domain.types/tenant/tenant.dto';
import { Loader } from '../../../startup/loader';
import { AuthHandler } from '../../../auth/auth.handler';
import { EmailService } from '../../../modules/communication/email/email.service';
import { EmailDetails } from '../../../modules/communication/email/email.details';
import { UserSearchFilters, UserSearchResults } from '../../../domain.types/users/user/user.search.types';
import { MostRecentActivityDto } from '../../../domain.types/users/patient/activity.tracker/activity.tracker.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserService {

    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IOtpRepo') private _otpRepo: IOtpRepo,
        @inject('IInternalTestUserRepo') private _internalTestUserRepo: IInternalTestUserRepo,
        @inject('IUserLoginSessionRepo') private _userLoginSessionRepo: IUserLoginSessionRepo,
        @inject('IUserDeviceDetailsRepo') private _userDeviceDetailsRepo: IUserDeviceDetailsRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
    ) {}

    //#region Publics

    public create = async (model: UserDomainModel) => {
        // timezone sanitization
        if (model.DefaultTimeZone != null) {
            model.DefaultTimeZone = this.sanitizeTimezone(model.DefaultTimeZone);
        }
        if (model.CurrentTimeZone != null) {
            model.CurrentTimeZone = this.sanitizeTimezone(model.CurrentTimeZone);
        } else if (model.DefaultTimeZone != null) {
            model.CurrentTimeZone = model.DefaultTimeZone;
        }

        var dto = await this._userRepo.create(model);
        if (dto == null) {
            return null;
        }
        if (model.RoleId && dto.PersonId) {
            await this._personRoleRepo.addPersonRole(dto.PersonId, model.RoleId);
        }
        dto = await this.updateDetailsDto(dto);
        await this.generateLoginOtp(model, dto);
        return dto;
    };

    public getById = async (id: string): Promise<UserDetailsDto> => {
        var dto = await this._userRepo.getById(id);
        Logger.instance().log(`DTO from user repo: ${JSON.stringify(dto)}`);
        dto = await this.updateDetailsDto(dto);
        Logger.instance().log(`Update details DTO: ${JSON.stringify(dto)}`);
        return dto;
    };

    public getByPersonId = async (personId: string): Promise<UserDetailsDto[]> => {
        var users_: UserDetailsDto[] = await this._userRepo.getByPersonId(personId);
        var users: UserDetailsDto[] = [];
        for await (var user of users_) {
            user = await this.updateDetailsDto(user);
            users.push(user);
        }
        return users;
    };

    public getByPhoneAndRole = async (phone: string, roleId: number): Promise<UserDetailsDto> => {
        var dto = await this._userRepo.getByPhoneAndRole(phone, roleId);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public getExistingUser = async (basicDetails: UserBasicDetails, roleId: number): Promise<UserDetailsDto> => {
        let user = null;
        if (basicDetails.Phone) {
            user = await this._userRepo.getByPhoneAndRole(basicDetails.Phone, roleId);
        }
        if (user == null && basicDetails.Email) {
            user = await this._userRepo.getByEmailAndRole(basicDetails.Email, roleId);
        }
        if (user == null && basicDetails.UniqueReferenceId) {
            user = await this._userRepo.getByUniqueReferenceIdAndRole(basicDetails.UniqueReferenceId, roleId);
        }
        user = await this.updateDetailsDto(user);
        return user;
    };

    public getByUserName = async (userName: string): Promise<UserDetailsDto> => {
        var dto = await this._userRepo.getByUserName(userName);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public getUserRoleName = async (userId: string): Promise<string> => {
        var dto = await this._userRepo.getById(userId);
        dto = await this.updateDetailsDto(dto);
        return dto.Role.RoleName;
    };

    public getByEmailAndRole = async (email: string, roleId: number): Promise<UserDetailsDto> => {
        var dto = await this._userRepo.getByEmailAndRole(email, roleId);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public getUserByTenantIdAndRole = async (tenantId: string, roleName: string): Promise<UserDetailsDto> => {
        var dto = await this._userRepo.getUserByTenantIdAndRole(tenantId, roleName);
        return dto;
    };

    public getUserByPersonIdAndRole = async (personId: string, loginRoleId: number): Promise<UserDetailsDto> => {
        var dto = await this._userRepo.getUserByPersonIdAndRole(personId, loginRoleId);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public update = async (id: string, model: UserDomainModel): Promise<UserDetailsDto> => {
        // timezone sanitization

        if (model.DefaultTimeZone != null) {
            model.DefaultTimeZone = this.sanitizeTimezone(model.DefaultTimeZone);
        }
        if (model.CurrentTimeZone != null) {
            model.CurrentTimeZone = this.sanitizeTimezone(model.CurrentTimeZone);
        } else if (model.DefaultTimeZone != null) {
            model.CurrentTimeZone = model.DefaultTimeZone;
        }
        var dto = await this._userRepo.update(id, model);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (filters: UserSearchFilters): Promise<UserSearchResults> => {
        return await this._userRepo.search(filters);
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._userRepo.delete(id);
    };

    public loginWithPassword = async (loginModel: UserLoginDetails): Promise<any> => {

        var isTestUser = await this._internalTestUserRepo.isInternalTestUser(loginModel.Phone);
        
        if (isTestUser && loginModel.Phone.startsWith('+')) {
            loginModel.Phone = loginModel.Phone.split('-')[1];
        }

        const user: UserDetailsDto = await this.checkUserDetails(
            loginModel.Phone,
            loginModel.Email,
            loginModel.UserName,
            loginModel.LoginRoleId,
            loginModel.TenantId
        );
        var tenant = await this.checkTenant(user);

        if (!isTestUser) {
            const hashedPassword = await this._userRepo.getUserHashedPassword(user.id);
            const isPasswordValid = Helper.compare(loginModel.Password, hashedPassword);
            if (!isPasswordValid) {
                throw new ApiError(401, 'Invalid password!');
            }
        }

        await this._userRepo.updateLastLogin(user.id);

        //Generate login session

        const expiresIn: number = ConfigurationManager.AccessTokenExpiresInSeconds();
        var sessionValidTill = TimeHelper.addDuration(new Date(), expiresIn, DurationType.Second);

        var entity: UserLoginSessionDomainModel = {
            UserId    : user.id,
            IsActive  : true,
            StartedAt : new Date(),
            ValidTill : sessionValidTill,
        };

        const loginSessionDetails = await this._userLoginSessionRepo.create(entity);

        //The following user data is immutable. Don't include any mutable data

        var currentUser: CurrentUser = {
            UserId        : user.id,
            TenantId      : tenant.id,
            TenantCode    : tenant.Code,
            TenantName    : tenant.Name,
            DisplayName   : user.Person.DisplayName,
            Phone         : user.Person.Phone,
            Email         : user.Person.Email,
            UserName      : user.UserName,
            CurrentRoleId : user.Role.id,
            CurrentRole   : user.Role.RoleName,
            SessionId     : loginSessionDetails.id,
            IsTestUser    : isTestUser,
        };

        const sessionId = currentUser.SessionId;
        const accessToken = await AuthHandler.generateUserSessionToken(currentUser);
        var refreshToken = null;
        if (ConfigurationManager.UseRefreshToken()) {
            refreshToken = await AuthHandler.generateRefreshToken(user.id, sessionId, tenant.id);
        }

        return {
            user,
            accessToken,
            refreshToken : refreshToken ?? null,
            sessionId,
            sessionValidTill,
        };
    };

    public loginWithOtp = async (loginModel: UserLoginDetails): Promise<any> => {

        var isTestUser = await this.isInternalTestUser(loginModel.Phone);

        if (isTestUser && loginModel.Phone.startsWith('+')) {
            loginModel.Phone = loginModel.Phone.split('-')[1];
        }

        const user: UserDetailsDto = await this.checkUserDetails(
            loginModel.Phone,
            loginModel.Email,
            loginModel.UserName,
            loginModel.LoginRoleId,
            loginModel.TenantId
        );
        var tenant = await this.checkTenant(user);

        if (!isTestUser) {
            const storedOtp = await this._otpRepo.getByOtpAndUserId(user.id, loginModel.Otp);
            if (!storedOtp) {
                throw new ApiError(404, 'Active OTP record not found!');
            }
            const date = new Date();
            if (storedOtp.ValidTill <= date) {
                throw new ApiError(400, 'Login OTP has expired. Please regenerate OTP again!');
            }
        }

        await this._userRepo.updateLastLogin(user.id);

        //Generate login session

        const expiresIn: number = ConfigurationManager.AccessTokenExpiresInSeconds();
        var sessionValidTill = TimeHelper.addDuration(new Date(), expiresIn, DurationType.Second);

        var entity: UserLoginSessionDomainModel = {
            UserId    : user.id,
            IsActive  : true,
            StartedAt : new Date(),
            ValidTill : sessionValidTill
        };

        const loginSessionDetails = await this._userLoginSessionRepo.create(entity);

        //The following user data is immutable. Don't include any mutable data

        var currentUser: CurrentUser = {
            UserId        : user.id,
            TenantId      : tenant.id,
            TenantCode    : tenant.Code,
            TenantName    : tenant.Name,
            DisplayName   : user.Person.DisplayName,
            Phone         : user.Person.Phone,
            Email         : user.Person.Email,
            UserName      : user.UserName,
            CurrentRoleId : user.Role.id,
            CurrentRole   : user.Role.RoleName,
            SessionId     : loginSessionDetails.id,
            IsTestUser    : isTestUser,
        };

        const sessionId = currentUser.SessionId;
        const accessToken = await AuthHandler.generateUserSessionToken(currentUser);
        var refreshToken = null;
        if (ConfigurationManager.UseRefreshToken()) {
            refreshToken = await AuthHandler.generateRefreshToken(user.id, sessionId, tenant.id);
        }

        return {
            user,
            accessToken,
            refreshToken : refreshToken ?? null,
            sessionId,
            sessionValidTill
        };
    };

    public generateOtp = async (otpModel: OtpGenerationModel): Promise<UserAccountActionResult> => {

        var isTestUser = await this.isInternalTestUser(otpModel.Phone);
        if (isTestUser) {
            return { Success: true, User: null };
        }

        let person: PersonDetailsDto = null;

        if (otpModel.Phone && otpModel.Phone?.length > 0) {
            person = await this._personRepo.getPersonWithPhone(otpModel.Phone);
            if (person == null) {
                const message = 'User does not exist with phone(' + otpModel.Phone + ')';
                throw new ApiError(404, message);
            }
        } else if (otpModel.Email && otpModel.Email?.length > 0) {
            person = await this._personRepo.getPersonWithEmail(otpModel.Email);
            if (person == null) {
                const message = 'User does not exist with email(' + otpModel.Email + ')';
                throw new ApiError(404, message);
            }
        }
        if (person == null) {
            throw new ApiError(404, 'Cannot find user.');
        }

        //Now check if that person is a user with a given role
        const personId = person.id;
        var user: UserDetailsDto = await this._userRepo.getUserByPersonIdAndRole(personId, otpModel.RoleId);
        user = await this.updateDetailsDto(user);
        if (person == null || user == null) {
            throw new ApiError(404, 'Cannot find user with the given role.');
        }

        var otp = await this.createOtp(otpModel.Purpose, user.id, 5);

        const systemIdentifier = ConfigurationManager.SystemIdentifier();

        var userFirstName = 'user';
        if (user.Person && user.Person.FirstName) {
            userFirstName = user.Person.FirstName;
        }

        const message = `Dear ${userFirstName}, ${otp} is OTP for your ${systemIdentifier} account and will expire in 5 minutes.`;
        const sendStatus = await Loader.messagingService.sendSMS(user.Person.Phone, message);
        if (sendStatus) {
            Logger.instance().log(`Otp sent successfully. OTP: ${otp}\n `);
        }

        return { Success: sendStatus, User: user };
    };

    public changePassword = async (model: ChangePasswordModel): Promise<UserAccountActionResult> => {

        const userLoginModel: UserLoginDetails = {
            Phone       : model.Phone,
            Email       : model.Email,
            UserName    : model.UserName,
            LoginRoleId : model.RoleId
        };
        const user: UserDetailsDto = await this.checkUserDetails(
            userLoginModel.Phone,
            userLoginModel.Email,
            userLoginModel.UserName,
            userLoginModel.LoginRoleId
        );

        if (user == null) {
            throw new ApiError(404, 'User not found.');
        }

        const hashedPassword = await this._userRepo.getUserHashedPassword(user.id);
        const isPasswordValid = Helper.compare(model.OldPassword, hashedPassword);
        if (!isPasswordValid) {
            const message = 'Invalid old password! Please provide correct old password. If you have forgotten your password, please use the "Forgot Password" feature.';
            throw new ApiError(401, message);
        }

        const newPasswordHash = Helper.hash(model.NewPassword);
        await this._userRepo.updateUserHashedPassword(user.id, newPasswordHash);

        return { Success: true, User: user };
    };

    public resetPassword = async (model: ResetPasswordModel): Promise<UserAccountActionResult> => {

        const userLoginModel: UserLoginDetails = {
            Phone       : model.Phone,
            Email       : model.Email,
            UserName    : model.UserName,
            LoginRoleId : model.RoleId
        };
        const user: UserDetailsDto = await this.checkUserDetails(
            userLoginModel.Phone,
            userLoginModel.Email,
            userLoginModel.UserName,
            model.RoleId,
        );

        if (user == null) {
            throw new ApiError(404, 'User not found.');
        }

        const storedOtp = await this._otpRepo.getByOtpAndUserId(user.id, model.ResetCode, 'PasswordReset');
        if (!storedOtp) {
            throw new ApiError(404, 'Invalid password reset code!');
        }
        const date = new Date();
        if (storedOtp.ValidTill <= date) {
            throw new ApiError(400, 'Password reset code has expired. Please regenerate code again!');
        }

        const newPasswordHash = Helper.hash(model.NewPassword);
        await this._userRepo.updateUserHashedPassword(user.id, newPasswordHash);

        return { Success: true, User: user };
    };

    public sendPasswordResetCode = async (model: SendPasswordResetCodeModel): Promise<UserAccountActionResult> => {
        const userLoginModel: UserLoginDetails = {
            Phone       : model.Phone,
            Email       : model.Email,
            UserName    : model.UserName,
            LoginRoleId : model.RoleId
        };
        const user: UserDetailsDto = await this.checkUserDetails(
            userLoginModel.Phone,
            userLoginModel.Email,
            userLoginModel.UserName,
            model.RoleId,
        );

        if (!userLoginModel.Phone) {
            user.Person.Phone = null;
        }
        if (!userLoginModel.Email) {
            user.Person.Email = null;
        }

        const successful = await this.sendPasswordResetOtp(user);
        if (successful) {
            Logger.instance().log(`Password reset code sent successfully to user ${user.Person.DisplayName}.`);
        }

        return { Success: successful, User: user };
    };

    public invalidateSession = async (sesssionId: uuid): Promise<boolean> => {
        var invalidated = await this._userLoginSessionRepo.invalidateSession(sesssionId);
        return invalidated;
    };

    public invalidateAllSessions = async (userId: uuid): Promise<boolean> => {
        var invalidatedAllSessions = await this._userLoginSessionRepo.invalidateAllSessions(userId);
        return invalidatedAllSessions;
    };

    public rotateUserAccessToken = async (refreshToken: string): Promise<string> => {
        return await AuthHandler.rotateUserSessionToken(refreshToken);
    };

    public generateUserName = async (
        firstName: string | null | undefined,
        lastName: string | null | undefined): Promise<string> => {
        if (!firstName) {
            firstName = generate({ length: 4, numbers: false, lowercase: true, uppercase: false, symbols: false });
        }
        if (!lastName) {
            lastName = generate({ length: 4, numbers: false, lowercase: true, uppercase: false, symbols: false });
        }
        let userName = this.constructUserName(firstName, lastName);
        let exists = await this._userRepo.userExistsWithUsername(userName);
        while (exists) {
            userName = this.constructUserName(firstName, lastName);
            exists = await this._userRepo.userExistsWithUsername(userName);
        }
        return userName;
    };

    public generateUserDisplayId = async (role: Roles, phone, phoneCount = 0) => {
        let prefix = '';

        if (role === Roles.Doctor) {
            prefix = 'DR#';
        } else if (role === Roles.Patient) {
            prefix = 'PT#';
        } else if (role === Roles.LabUser) {
            prefix = 'LU#';
        } else if (role === Roles.PharmacyUser) {
            prefix = 'PU#';
        }

        let str = '';
        if (phone != null && typeof phone !== 'undefined') {
            const phoneTemp = phone.toString();
            const tokens = phoneTemp.split('+');
            let s = tokens.length > 1 ? tokens[1] : phoneTemp;

            s = s.trim();
            s = s.replace('+', '');
            s = s.replace(' ', '');
            s = s.replace('-', '');

            if (role === Roles.Patient) {
                const idx = (phoneCount + 1).toString();
                str = str + idx + '-' + s;
            } else {
                str = str + '0-' + s;
            }
        } else {
            const tmp = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
            str = tmp.substring(-10);
        }
        str = str.substring(0, 20);

        const displayId = prefix + str;
        return displayId;
    };

    public updateCurrentTimezone = async () => {
        try {
            const users = await this._userRepo.getAllRegisteredUsers();
            for await (var u of users) {
                var extractedResult = await this.sanitizeTimezone(u.DefaultTimeZone);
                u.CurrentTimeZone = extractedResult;
                var entity: UserDomainModel = {
                    CurrentTimeZone : extractedResult,
                    DefaultTimeZone : extractedResult,
                };
                const updateUser = await this._userRepo.update(u.id, entity);
                Logger.instance().log(
                    `CurrentTimezone :: ${updateUser.CurrentTimeZone} and DefualtTimezone :: ${updateUser.CurrentTimeZone}  for ${u.id}`
                );
            }
        } catch (error) {
            Logger.instance().log(`Error updating the current timezone.`);
        }
    };

    public getDateInUserTimeZone = async (userId, dateStr: string, useCurrent = true) => {
        var user = await this.getById(userId);
        if (user === null) {
            throw new ApiError(422, 'Invalid user id.');
        }
        var timezoneOffset = '+05:30';
        if (user.CurrentTimeZone !== null && useCurrent) {
            timezoneOffset = user.CurrentTimeZone;
        } else if (user.DefaultTimeZone !== null) {
            timezoneOffset = user.DefaultTimeZone;
        }
        return TimeHelper.getDateWithTimezone(dateStr, timezoneOffset);
    };

    public isValidUserLoginSession = async (sessionId: uuid): Promise<boolean> => {
        const isValidLoginSession = await this._userLoginSessionRepo.isValidUserLoginSession(sessionId);
        return isValidLoginSession;
    };

    public isInternalTestUser = async (phone: string): Promise<boolean> => {
        var startingRange = 1000000001;
        var endingRange = startingRange + parseInt(process.env.NUMBER_OF_INTERNAL_TEST_USERS) - 1;
        if (phone.startsWith('+')) {
            var phoneNumber = parseInt(phone.split('-')[1]);
        } else {
            phoneNumber = parseInt(phone);
        }
        var isTestUser = false;
        if (phoneNumber >= startingRange && phoneNumber <= endingRange) {
            isTestUser = true;
        }
        return isTestUser;
    };

    public isTenantUser = async (userId: uuid, tenantId: uuid): Promise<boolean> => {
        var isTenantUser = await this._userRepo.isTenantUser(userId, tenantId);
        return isTenantUser;
    };

    public getTenantsForUser = async (userId: uuid): Promise<TenantDto[]> => {
        var tenants = await this._userRepo.getTenantsForUser(userId);
        return tenants;
    };

    public seedSystemAdmin = async () => {
        try {
            const SeededSystemAdmin = Helper.loadJSONSeedFile('system.admin.seed.json');
            const exists = await this._userRepo.userNameExists(SeededSystemAdmin.UserName);
            if (exists) {
                return;
            }

            const tenant = await this._tenantRepo.getTenantWithCode('default');
            const role = await this._roleRepo.getByName(Roles.SystemAdmin);

            const userDomainModel: UserDomainModel = {
                Person : {
                    Phone     : SeededSystemAdmin.Phone,
                    Email     : SeededSystemAdmin.Email,
                    FirstName : SeededSystemAdmin.FirstName,
                },
                TenantId        : tenant.id,
                UserName        : SeededSystemAdmin.UserName,
                Password        : SeededSystemAdmin.Password,
                DefaultTimeZone : SeededSystemAdmin.DefaultTimeZone,
                CurrentTimeZone : SeededSystemAdmin.CurrentTimeZone,
                RoleId          : role.id,
            };

            const person = await this._personRepo.create(userDomainModel.Person);
            userDomainModel.Person.id = person.id;
            await this._userRepo.create(userDomainModel);
            await this._personRoleRepo.addPersonRole(person.id, role.id);

            Logger.instance().log('Seeded admin user successfully!');
        } catch (error) {
            Logger.instance().log(error);
        }
    };

    public checkUsersWithoutTenants = async () => {
        await this._userRepo.checkUsersWithoutTenants();
    };

    public getExistingPerson = async (model: UserBasicDetails): Promise<PersonDetailsDto> => {

        let person: PersonDetailsDto = null;
        let user: UserDetailsDto = {};

        if (model.Phone) {
            person = await this._personRepo.getPersonWithPhone(model.Phone);
            if (person == null) {
                const message = 'User does not exist with phone(' + model.Phone + ')';
                Logger.instance().log(message);
            }
        }
        if (model.Email && !person) {
            person = await this._personRepo.getPersonWithEmail(model.Email);
            if (person == null) {
                const message = 'User does not exist with email(' + model.Email + ')';
                Logger.instance().log(message);
            }
        }
        if (model.UserName && !person) {
            user = await this._userRepo.getUserWithUserName(model.UserName);
            user = await this.updateDetailsDto(user);
            if (user == null) {
                const message = 'User does not exist with username (' + model.UserName + ')';
                Logger.instance().log(message);
            } else {
                person = await this._personRepo.getById(user.Person.id);
            }
        }
        if (model.UniqueReferenceId && !person) {
            person = await this._personRepo.getPersonWithUniqueReferenceId(model.UniqueReferenceId);
            if (person == null) {
                const message = 'User does not exist with unique reference id (' + model.UniqueReferenceId + ')';
                Logger.instance().log(message);
            }
        }
        if (person == null) {
            return null;
        }

        return person;
    };

    getRecentUserActivity = async (): Promise<MostRecentActivityDto[]> => {
        return await this._userRepo.getRecentUserActivity();
    };

    //#endregion

    //#region Privates

    private checkTenant = async (user: UserDetailsDto): Promise<TenantDto> => {
        const tenantId = user.TenantId;
        var tenant = await this._tenantRepo.getById(tenantId);
        if (tenant == null) {
            throw new ApiError(404, 'Tenant not found.');
        }
        return tenant;
    };

    private async createOtp(purpose: string, userId: uuid, validityInMinutes = 5) {

        const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
        const currMillsecs = Date.now();
        const validTill = new Date(currMillsecs + (validityInMinutes * 60 * 1000));

        const otpEntity: OtpPersistenceEntity = {
            Purpose   : purpose,
            UserId    : userId,
            Otp       : otp,
            ValidFrom : new Date(),
            ValidTill : validTill,
        };

        const otpDto = await this._otpRepo.create(otpEntity);
        Logger.instance().log(`OTP : ${JSON.stringify(otpDto, null, 2)}`);

        return otp;
    }

    private constructUserName(firstName: string, lastName: string) {
        const rand = Math.random().toString(10)
            .substring(2, 4);
        let userName = firstName.substring(0, 3) + lastName.substring(0, 3) + rand;
        userName = userName.toLowerCase();
        return userName;
    }

    private async checkUserDetails(
        phone: string | undefined | null,
        email: string | undefined | null,
        username: string | undefined | null,
        roleId: number,
        tenantId: string = null
    ): Promise<UserDetailsDto> {

        let person: PersonDetailsDto = null;
        let user: UserDetailsDto = null;
        let userId = null;

        var search: any = {};
        if (phone) {
            search['Phone'] = phone;
        }
        if (email) {
            search['Email'] = email;
        }
        if (phone) {
            search['Phone'] = phone;
        }
        if (username) {
            search['UserName'] = username;
        }
        if (roleId) {
            search['RoleIds'] = [roleId];
        }
        if (tenantId) {
            search['TenantId'] = tenantId;
        }

        if (phone) {
            const searchResult = await this._userRepo.search(search);
            userId = searchResult.TotalCount > 0 ? searchResult.Items[0].id : null;
            if (userId == null) {
                const message = 'User does not exist with phone(' + phone + ')';
                throw new ApiError(404, message);
            }
        } else if (email) {
            const searchResult = await this._userRepo.search(search);
            userId = searchResult.TotalCount > 0 ? searchResult.Items[0].id : null;
            if (userId == null) {
                const message = 'User does not exist with email(' + email + ')';
                throw new ApiError(404, message);
            }
        } else if (username) {
            user = await this._userRepo.getUserWithUserName(username);
            user = await this.updateDetailsDto(user);
            if (user == null) {
                //Check if the email has been given as username
                if (!email) {
                    search = {
                        Email : username,
                    };
                    if (roleId) {
                        search['RoleIds'] = [roleId];
                    }
                    const searchResult = await this._userRepo.search(search);
                    userId = searchResult.TotalCount > 0 ? searchResult.Items[0].id : null;
                }
                if (userId == null) {
                    const message = 'User does not exist with username or email (' + username + ')';
                    throw new ApiError(404, message);
                }
            }
            userId = user.id;
            person = await this._personRepo.getById(user.Person.id);
        }

        if (userId == null) {
            throw new ApiError(404, 'Cannot find user.');
        }

        user  = await this._userRepo.getById(userId);
        if (user == null) {
            throw new ApiError(404, 'Cannot find user.');
        }
        user = await this.updateDetailsDto(user);
        user.Person = user.Person ?? person;

        return user;
    }

    private async generateLoginOtp(userDomainModel: UserDomainModel, user: UserDetailsDto) {
        if (userDomainModel.GenerateLoginOTP === true) {
            const obj = {
                Phone   : user.Person.Phone,
                Email   : user.Person.Email,
                UserId  : user.id,
                Purpose : 'Login',
            };
            const successful = await this.generateOtp(obj);
            if (successful) {
                Logger.instance().log(`Login OTP sent successfully to user ${user.Person.DisplayName}.`);
            }
        }
    }
    
    private sendPasswordResetOtp = async (user: UserDetailsDto): Promise<boolean> => {

        if (user == null) {
            throw new ApiError(404, 'User not found.');
        }
        const phone = user.Person.Phone;
        const email = user.Person.Email;

        const systemIdentifier = ConfigurationManager.SystemIdentifier();

        var userFirstName = 'user';
        if (user.Person && user.Person.FirstName) {
            userFirstName = user.Person.FirstName;
        }

        const otp = await this.createOtp('PasswordReset', user.id, 10);

        var successful = false;
        if (phone && phone?.length > 0) {
            const message = `Dear ${userFirstName}, ${otp} is OTP for your ${systemIdentifier} account and will expire in 10 minutes.`;
            const smsStatus = await Loader.messagingService.sendSMS(user.Person.Phone, message);
            if (smsStatus) {
                Logger.instance().log(`Password reset code sent successfully through SMS! OTP: ${otp}\n `);
            }
            successful = smsStatus || successful;
        } else if (email && email?.length > 0) {
            const emailStatus = await this.sendPasswordResetEmail(email, otp, userFirstName);
            if (emailStatus) {
                Logger.instance().log(`Password reset code sent successfully through Email! OTP: ${otp}\n `);
            }
            successful = emailStatus || successful;
        }

        if (successful) {
            Logger.instance().log(`Password reset code sent successfully to user ${user.Person.DisplayName}.`);
        }

        return true;
    };

    private updateDetailsDto = async (dto: UserDetailsDto): Promise<UserDetailsDto> => {
        if (dto == null) {
            return null;
        }
        if (dto.Person == null) {
            var person = await this._personRepo.getById(dto.PersonId);
            dto.Person = person;
        }
        if (dto.Role == null) {
            var role = await this._roleRepo.getById(dto.RoleId);
            dto.Role = role;
        }
        if (dto.TenantId && !dto.TenantName && !dto.TenantCode) {
            const tenant = await this._tenantRepo.getById(dto.TenantId);
            dto.TenantName = tenant.Name;
            dto.TenantCode = tenant.Code;
        }
        return dto;
    };

    // private updateDto = async (dto: UserDto): Promise<UserDto> => {
    //     if (dto == null) {
    //         return null;
    //     }
    //     if (dto.Person == null) {
    //         var person = await this._personRepo.getById(dto.PersonId);
    //         dto.Person = person;
    //     }
    //     return dto;
    // };

    // private getTenant = async (tenantId: uuid, tenantCode: string): Promise<TenantDto> => {
    //     var tenant = null;
    //     if (tenantId != null) {
    //         tenant = await this._tenantRepo.getById(tenantId);
    //     }
    //     if (tenant == null && tenantCode != null) {
    //         tenant = await this._tenantRepo.getTenantWithCode(tenantCode);
    //     }
    //     return tenant;
    // };

    private sanitizeTimezone = (inputString) => {
        const parts = inputString.split(':');

        if (parts.length < 3) {
            return inputString;
        }

        const extractedString = parts.slice(0, 2).join(':');
        return extractedString;
    };

    private sendPasswordResetEmail = async (email: string, otp: string, userFirstName: string) => {
        try {
            const emailService = new EmailService();
            var body = await emailService.getTemplate('password.reset.template.html');

            body = body.replace(/{{PLATFORM_NAME}}/g, process.env.PLATFORM_NAME);
            body = body.replace('{{USER_FIRST_NAME}}', userFirstName);
            body = body.replace('{{OTP}}', otp);
            const emailDetails: EmailDetails = {
                EmailTo : email,
                Subject : `Reset Password`,
                Body    : body,
            };
            Logger.instance().log(`Email details: ${JSON.stringify(emailDetails)}`);

            const sent = await emailService.sendEmail(emailDetails, false);
            if (!sent) {
                Logger.instance().log(`Unable to send email to ${email}`);
                return false;
            }
            return true;
        }
        catch (error) {
            Logger.instance().log(`Unable to send email to ${email}`);
            return false;
        }
    };

    //#endregion

}
