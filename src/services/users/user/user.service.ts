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
import { UserDomainModel, UserLoginDetails } from '../../../domain.types/users/user/user.domain.model';
import { UserDetailsDto, UserDto } from '../../../domain.types/users/user/user.dto';
import { Loader } from '../../../startup/loader';
import { UserLoginSessionDomainModel } from '../../../domain.types/users/user.login.session/user.login.session.domain.model';
import { DurationType } from '../../../domain.types/miscellaneous/time.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { IUserDeviceDetailsRepo } from '../../../database/repository.interfaces/users/user/user.device.details.repo.interface ';
import { IPatientRepo } from '../../../database/repository.interfaces/users/patient/patient.repo.interface';
import { IAssessmentTemplateRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface';
import { IAssessmentRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface';
import { IUserTaskRepo } from '../../../database/repository.interfaces/users/user/user.task.repo.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserService {

    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _userRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IOtpRepo') private _otpRepo: IOtpRepo,
        @inject('IInternalTestUserRepo') private _internalTestUserRepo: IInternalTestUserRepo,
        @inject('IUserLoginSessionRepo') private _userLoginSessionRepo: IUserLoginSessionRepo,
        @inject('IUserDeviceDetailsRepo') private _userDeviceDetailsRepo: IUserDeviceDetailsRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,

    ) {}

    //#region Publics

    public create = async (model: UserDomainModel) => {

        // timezone sanitization
        if (model.DefaultTimeZone) {
            const defaultTimezone = this.sanitizeTimezone(model.DefaultTimeZone); 
            model.DefaultTimeZone = defaultTimezone;
            model.CurrentTimeZone = defaultTimezone;
        }
        if (model.CurrentTimeZone) {
            const currentTimezone = model.CurrentTimeZone ?? model.DefaultTimeZone;
            model.CurrentTimeZone = this.sanitizeTimezone(currentTimezone); 
        }
    
        var dto = await this._userRepo.create(model);
        if (dto == null) {
            return null;
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

    public getByPhoneAndRole = async (phone: string, roleId: number): Promise<UserDetailsDto> => {
        var dto = await this._userRepo.getByPhoneAndRole(phone, roleId);
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

    public update = async (id: string, model: UserDomainModel): Promise<UserDetailsDto> => {

        // timezone sanitization

        if (model.DefaultTimeZone != null) {
            model.DefaultTimeZone = this.sanitizeTimezone(model.DefaultTimeZone); 
            model.CurrentTimeZone = model.DefaultTimeZone;
        }
        if (model.CurrentTimeZone != null) {
            model.CurrentTimeZone = this.sanitizeTimezone(model.CurrentTimeZone); 
        }  
        var dto = await this._userRepo.update(id, model);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._userRepo.delete(id);
    };

    public loginWithPassword = async (loginModel: UserLoginDetails): Promise<any> => {

        var isTestUser = await this._internalTestUserRepo.isInternalTestUser(loginModel.Phone);

        const user: UserDetailsDto = await this.checkUserDetails(loginModel);

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
            ValidTill : sessionValidTill
        };

        const loginSessionDetails = await this._userLoginSessionRepo.create(entity);

        //The following user data is immutable. Don't include any mutable data

        var currentUser: CurrentUser = {
            UserId        : user.id,
            DisplayName   : user.Person.DisplayName,
            Phone         : user.Person.Phone,
            Email         : user.Person.Email,
            UserName      : user.UserName,
            CurrentRoleId : loginModel.LoginRoleId,
            SessionId     : loginSessionDetails.id,
        };

        const sessionId = currentUser.SessionId;
        const accessToken = await Loader.authenticator.generateUserSessionToken(currentUser);
        var refreshToken = null;
        if (ConfigurationManager.UseRefreshToken()) {
            refreshToken = await Loader.authenticator.generateRefreshToken(user.id, sessionId);
        }

        return {
            user,
            accessToken,
            refreshToken : refreshToken ?? null,
            sessionId,
            sessionValidTill
        };
    };

    public generateOtp = async (otpDetails: any): Promise<boolean> => {

        var isTestUser = await this._internalTestUserRepo.isInternalTestUser(otpDetails.Phone);
        if (isTestUser) {
            return true;
        }

        let person: PersonDetailsDto = null;

        if (otpDetails.Phone) {
            person = await this._personRepo.getPersonWithPhone(otpDetails.Phone);
            if (person == null) {
                const message = 'User does not exist with phone(' + otpDetails.Phone + ')';
                throw new ApiError(404, message);
            }
        } else if (otpDetails.Email) {
            person = await this._personRepo.getPersonWithEmail(otpDetails.Email);
            if (person == null) {
                const message = 'User does not exist with email(' + otpDetails.Email + ')';
                throw new ApiError(404, message);
            }
        }
        if (person == null) {
            throw new ApiError(404, 'Cannot find user.');
        }

        //Now check if that person is an user with a given role
        const personId = person.id;
        var user: UserDetailsDto = await this._userRepo.getUserByPersonIdAndRole(personId, otpDetails.RoleId);
        user = await this.updateDetailsDto(user);
        if (person == null) {
            throw new ApiError(404, 'Cannot find user with the given role.');
        }

        var str = JSON.stringify(user, null, 2);
        Logger.instance().log(str);

        const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
        const currMillsecs = Date.now();
        const validTill = new Date(currMillsecs + (300 * 1000));

        const otpEntity: OtpPersistenceEntity = {
            Purpose   : otpDetails.Purpose,
            UserId    : user.id,
            Otp       : otp,
            ValidFrom : new Date(),
            ValidTill : validTill
        };

        const otpDto = await this._otpRepo.create(otpEntity);
        const systemIdentifier = ConfigurationManager.SystemIdentifier();

        var userFirstName = 'user';
        if (user.Person && user.Person.FirstName) {
            userFirstName = user.Person.FirstName;
        }
        const message = `Dear ${userFirstName}, ${otp} is OTP for your ${systemIdentifier} account and will expire in 3 minutes.`;
        const sendStatus = await Loader.messagingService.sendSMS(user.Person.Phone, message);
        if (sendStatus) {
            Logger.instance().log('Otp sent successfully.\n ' + JSON.stringify(otpDto, null, 2));
        }

        return true;
    };

    public loginWithOtp = async (loginModel: UserLoginDetails): Promise<any> => {

        var isTestUser = await this.isInternalTestUser(loginModel.Phone);

        const user: UserDetailsDto = await this.checkUserDetails(loginModel);

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
            DisplayName   : user.Person.DisplayName,
            Phone         : user.Person.Phone,
            Email         : user.Person.Email,
            UserName      : user.UserName,
            CurrentRoleId : loginModel.LoginRoleId,
            SessionId     : loginSessionDetails.id
        };

        const sessionId = currentUser.SessionId;
        const accessToken = await Loader.authenticator.generateUserSessionToken(currentUser);
        var refreshToken = null;
        if (ConfigurationManager.UseRefreshToken()) {
            refreshToken = await Loader.authenticator.generateRefreshToken(user.id, sessionId);
        }

        return {
            user,
            accessToken,
            refreshToken : refreshToken ?? null,
            sessionId,
            sessionValidTill
        };
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
        return await Loader.authenticator.rotateUserSessionToken(refreshToken);
    };

    public generateUserName = async (firstName, lastName):Promise<string> => {
        if (firstName == null) {
            firstName = generate({ length: 4, numbers: false, lowercase: true, uppercase: false, symbols: false });
        }
        if (lastName == null) {
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

    public generateUserDisplayId = async (role:Roles, phone, phoneCount = 0) => {

        let prefix = '';

        if (role === Roles.Doctor){
            prefix = 'DR#';
        } else if (role === Roles.Patient){
            prefix = 'PT#';
        } else if (role === Roles.LabUser){
            prefix = 'LU#';
        } else if (role === Roles.PharmacyUser){
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
        }
        else {
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
                var entity : UserDomainModel = {
                    CurrentTimeZone : extractedResult,
                    DefaultTimeZone : extractedResult
                };
                const updateUser = await this._userRepo.update(u.id, entity);
                Logger.instance().log(`CurrentTimezone :: ${updateUser.CurrentTimeZone} and DefualtTimezone :: ${updateUser.CurrentTimeZone}  for ${u.id}`);
            }
        }
        catch (error) {
            Logger.instance().log(`Error updating the current timezone.`);
        }
    };

    getDateInUserTimeZone = async(userId, dateStr: string, useCurrent = true) => {

        var user = await this.getById(userId);
        if (user === null) {
            throw new ApiError(422, 'Invalid user id.');
        }
        var timezoneOffset = '+05:30';
        if (user.CurrentTimeZone !== null && useCurrent) {
            timezoneOffset = user.CurrentTimeZone;
        }
        else if (user.DefaultTimeZone !== null) {
            timezoneOffset = user.DefaultTimeZone;
        }
        return TimeHelper.getDateWithTimezone(dateStr, timezoneOffset);
    };

    public isValidUserLoginSession = async (sessionId: uuid): Promise<boolean> => {

        const isValidLoginSession = await this._userLoginSessionRepo.isValidUserLoginSession(sessionId);
        return isValidLoginSession;
    };

    //#endregion

    //#region Privates

    private constructUserName(firstName: string, lastName: string) {
        const rand = Math.random()
            .toString(10)
            .substr(2, 4);
        let userName = firstName.substr(0, 3) + lastName.substr(0, 3) + rand;
        userName = userName.toLowerCase();
        return userName;
    }

    private async checkUserDetails(loginModel: UserLoginDetails): Promise<UserDetailsDto> {

        let person: PersonDetailsDto = null;
        let user: UserDetailsDto = null;

        if (loginModel.Phone) {
            person = await this._personRepo.getPersonWithPhone(loginModel.Phone);
            if (person == null) {
                const message = 'User does not exist with phone(' + loginModel.Phone + ')';
                throw new ApiError(404, message);
            }
        } else if (loginModel.Email) {
            person = await this._personRepo.getPersonWithEmail(loginModel.Email);
            if (person == null) {
                const message = 'User does not exist with email(' + loginModel.Email + ')';
                throw new ApiError(404, message);
            }
        } else if (loginModel.UserName) {
            user = await this._userRepo.getUserWithUserName(loginModel.UserName);
            user = await this.updateDetailsDto(user);
            if (user == null) {
                const message = 'User does not exist with username (' + loginModel.UserName + ')';
                throw new ApiError(404, message);
            }
            person = await this._personRepo.getById(user.Person.id);
        }
        if (person == null) {
            throw new ApiError(404, 'Cannot find person.');
        }

        //Now check if that person is an user with a given role
        const personId = person.id;
        if (user == null) {
            user = await this._userRepo.getUserByPersonIdAndRole(personId, loginModel.LoginRoleId);
            user = await this.updateDetailsDto(user);
            if (user == null) {
                throw new ApiError(404, 'Cannot find user with the given role.');
            }
        }
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
        return dto;
    };

    private updateDto = async (dto: UserDto): Promise<UserDto> => {
        if (dto == null) {
            return null;
        }
        if (dto.Person == null) {
            var person = await this._personRepo.getById(dto.PersonId);
            dto.Person = person;
        }
        return dto;
    };

    public isInternalTestUser = async (phone: string): Promise<boolean> => {
        var startingRange = 1000000001;
        var endingRange = startingRange + parseInt(process.env.NUMBER_OF_INTERNAL_TEST_USERS) - 1;
        var phoneNumber = parseInt(phone);
        var isTestUser = false;
        if (phoneNumber >= startingRange && phoneNumber <= endingRange) {
            isTestUser = true;
        }
        return isTestUser;
    };

    private sanitizeTimezone = (inputString) => {
        const parts = inputString.split(':');
        
        if (parts.length < 3) {
          return inputString;
        }
        
        const extractedString = parts.slice(0, 2).join(':');
        return extractedString;
    };

    //#endregion

}
