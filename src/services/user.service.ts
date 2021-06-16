import { Loader } from '../startup/loader';
import { IUserRepo } from '../data/repository.interfaces/user.repo.interface';
import { IUserRoleRepo } from '../data/repository.interfaces/user.role.repo.interface';
import { IRoleRepo } from '../data/repository.interfaces/role.repo.interface';
import { IOtpRepo } from '../data/repository.interfaces/otp.repo.interface';
import { IMessagingService } from '../modules/communication/interfaces/messaging.service.interface';
import { UserDetailsDto, UserDto, UserSearchFilters, UserLoginDetails, UserDomainModel } from '../data/domain.types/user.domain.types';
import { injectable, inject } from 'tsyringe';
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { compareSync } from 'bcryptjs';
import { CurrentUser } from '../data/domain.types/current.user';
import { OtpPersistenceEntity } from '../data/domain.types/otp.domain.types';
import { Roles } from '../data/domain.types/role.domain.types';
import { generate} from 'generate-password';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserService {
    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IUserRoleRepo') private _userRoleRepo: IUserRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IOtpRepo') private _otpRepo: IOtpRepo,
        @inject('IMessagingService') private _messagingService: IMessagingService
    ) {}

    createUser = async (userDomainModel: UserDomainModel) => {
        var entity = {
            FirstName: userDomainModel.FirstName,
            LastName: userDomainModel.LastName,
            Prefix: userDomainModel.Prefix,
            Phone: userDomainModel.Phone,
            Email: userDomainModel.Email ?? null,
            UserName: userDomainModel.UserName,
            Password: userDomainModel.Password,
        };

        var user = await this._userRepo.create(entity);
        if (user == null) {
            return null;
        }

        if (userDomainModel.hasOwnProperty('GenerateLoginOTP') && userDomainModel.GenerateLoginOTP === true) {
            var obj = {
                Phone: user.Phone,
                Email: user.Email,
                UserId: user.id,
                Purpose: 'Login',
            };
            var successful = await this.generateOtp(obj);
            if (successful) {
                Logger.instance().log(`Login OTP sent successfully to user ${user.DisplayName}.`);
            }
        }
        return user;
    };

    public getById = async (id: string): Promise<UserDetailsDto> => {
        return await this._userRepo.getById(id);
    };

    public search = async (
        filters: UserSearchFilters,
        full: boolean = false
    ): Promise<UserDetailsDto[] | UserDto[]> => {
        if (full) {
            return await this._userRepo.searchFull(filters);
        } else {
            return await this._userRepo.searchLight(filters);
        }
    };

    public update = async (id: string, userDomainModel: UserDomainModel): Promise<UserDetailsDto> => {
        return await this._userRepo.update(id, userDomainModel);
    };

    public loginWithPassword = async (loginObject: UserLoginDetails): Promise<any> => {

        var user: UserDetailsDto = null;

        if (loginObject.Phone) {
            user = await this._userRepo.getUserWithPhone(loginObject.Phone);
            if (user == null) {
                let message = 'User does not exist with phone(' + loginObject.Phone + ')';
                throw new ApiError(404, message);
            }
        } else if (loginObject.Email) {
            user = await this._userRepo.getUserWithPhone(loginObject.Email);
            if (user == null) {
                let message = 'User does not exist with email(' + loginObject.Email + ')';
                throw new ApiError(404, message);
            }
        }
        if (user == null) {
            throw new ApiError(404, 'An error occurred authenticating the user.');
        }

        var hashedPassword = await this._userRepo.getUserHashedPassword(user.id);
        var isPasswordValid = await compareSync(loginObject.Password, hashedPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password!');
        }

        //The following user data is immutable. Don't include any mutable data
        var currentUser: CurrentUser = {
            UserId: user.id,
            DisplayName: user.DisplayName,
            Phone: user.Phone,
            Email: user.Email,
            CurrentRoleId: loginObject.LoginRoleId,
        };
        var accessToken = Loader.authorizer.generateUserSessionToken(currentUser);

        return { user: user, accessToken: accessToken };
    };

    public generateOtp = async (obj: any): Promise<boolean> => {

        var user: UserDetailsDto = null;

        if (obj.Phone) {
            user = await this._userRepo.getUserWithPhone(obj.Phone);
            if (user == null) {
                let message = 'User does not exist with phone(' + obj.Phone + ')';
                throw new ApiError(404, message);
            }
        } else if (obj.Email) {
            user = await this._userRepo.getUserWithPhone(obj.Email);
            if (user == null) {
                let message = 'User does not exist with email(' + obj.Email + ')';
                throw new ApiError(404, message);
            }
        }
        if (user == null) {
            throw new ApiError(404, 'An error occurred authenticating the user.');
        }

        var otp = (Math.floor(Math.random() * 900000) + 100000).toString();
        var currMillsecs = Date.now();
        var validTo = new Date(currMillsecs + (300 * 1000));

        var otpEntity: OtpPersistenceEntity = {
            Purpose: obj.Purpose,
            UserId: user.id,
            Otp: otp,
            ValidFrom: new Date(),
            ValidTo: validTo
        }

        var otpDto = await this._otpRepo.create(otpEntity);
        var message = `Hello ${user.DisplayName}, ${otp} is OTP for your REANCare account and will expire in 5 minutes. If you have not requested this OTP, please contact REANCare support.`;
        var sendStatus = await this._messagingService.sendSMS(user.Phone, message);
        if(sendStatus) {
            Logger.instance().log('Otp sent successfully.\n ' + JSON.stringify(otpDto, null, 2));
        }

        return true;
    };

    public loginWithOtp = async (loginObject: UserLoginDetails): Promise<any> => {
        var user: UserDetailsDto = null;

        if (loginObject.Phone) {
            user = await this._userRepo.getUserWithPhone(loginObject.Phone);
            if (user == null) {
                let message = 'User does not exist with phone(' + loginObject.Phone + ')';
                throw new ApiError(404, message);
            }
        } else if (loginObject.Email) {
            user = await this._userRepo.getUserWithPhone(loginObject.Email);
            if (user == null) {
                let message = 'User does not exist with email(' + loginObject.Email + ')';
                throw new ApiError(404, message);
            }
        }
        if (user == null) {
            throw new ApiError(404, 'An error occurred authenticating the user.');
        }

        var storedOtp = await this._otpRepo.getByOtpAndUserId(user.id, loginObject.Otp);
        if(!storedOtp) {
            throw new ApiError(404, 'Active Otp record not found!');
        }
        var date = new Date();
        if (storedOtp.ValidTo <= date) {
            throw new ApiError(400, 'Login OTP has expired. Please regenerate OTP again!');
        }

        //The following user data is immutable. Don't include any mutable data
        var currentUser: CurrentUser = {
            UserId: user.id,
            DisplayName: user.DisplayName,
            Phone: user.Phone,
            Email: user.Email,
            CurrentRoleId: loginObject.LoginRoleId,
        };
        var accessToken = Loader.authorizer.generateUserSessionToken(currentUser);

        return { user: user, accessToken: accessToken };
    };

    public generateUserName = async (firstName, lastName):Promise<string> => {
        if(firstName == null) {
            firstName = generate({length: 4, numbers: false, lowercase: true, uppercase: false, symbols: false});
        }
        if(lastName == null) {
            lastName = generate({length: 4, numbers: false, lowercase: true, uppercase: false, symbols: false});
        }
        var rand = Math.random().toString(10).substr(2, 5);
        var userName = firstName.substr(0, 3) + lastName.substr(0, 3) + rand;
        userName = userName.toLowerCase();
        var exists = await this._userRepo.userExistsWithUsername(userName);
        while (exists) {
            rand = Math.random().toString(36).substr(2, 5);
            userName = firstName.substr(0, 3) + lastName.substr(0, 2) + rand;
            userName = userName.toLowerCase();
            exists = await this._userRepo.userExistsWithUsername(userName);
        }
        return userName;
    }

    public generateUserDisplayId = async (role:Roles, phone, phoneCount = 0) => {

        var prefix = '';
    
        if(role == Roles.Doctor){
            prefix = 'DR#';
        }else if(role == Roles.Patient){
            prefix = 'PT#';
        }else if(role == Roles.LabUser){
            prefix = 'LU#';
        }else if(role == Roles.PharmacyUser){
            prefix = 'PU#';
        }
    
        var str = '';
        if (phone != null && typeof phone != 'undefined') {
    
            var phoneTemp = phone.toString();
            var tokens = phoneTemp.split('+');
            var s = tokens.length > 1 ? tokens[1] : phoneTemp;

            if(s.startsWith('91')){
                s = s.slice(2);
            }
            s = s.trim();
            s = s.replace('+', '');
            s = s.replace(' ', '');
            s = s.replace('-', '');
    
            if (role == Roles.Patient) {
                var idx = (phoneCount + 1).toString();
                str = str + idx + '-' + s;
            } else {
                str = str + '0-' + s;
            }
        }
        else {
            var tmp = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
            str = tmp.substr(-10);
        }
        str = str.substr(0, 20);
    
        var username = prefix + str;
        
        var exists = await exports.UserNameExists(username);
        while(exists)
        {
            tmp = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
            str = tmp.substr(-10);
            username = prefix + str;
            exists = await exports.UserNameExists(username);
        }
    
        return username;
    }
    
    // resetPassword = async (obj: any): Promise<boolean> => {
    //     return true;
    // };

}
