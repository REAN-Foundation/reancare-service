import { IUserRepo } from '../data/repository.interfaces/user.repo.interface';
import { IUserRoleRepo } from '../data/repository.interfaces/user.role.repo.interface';
import { IRoleRepo } from '../data/repository.interfaces/role.repo.interface';
import { UserDTO, UserDTOLight, UserSearchFilters, UserLoginRequestDTO } from '../data/dtos/user.dto';
import { injectable, inject } from 'tsyringe';
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { compareSync } from 'bcryptjs';
import { CurrentUser } from '../data/dtos/current.user.dto';
import { Loader } from '../startup/loader';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserService {
    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IUserRoleRepo') private _userRoleRepo: IUserRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo
    ) {}

    createUser = async (requestDto) => {
        var entity = {
            FirstName: requestDto.FirstName,
            LastName: requestDto.LastName,
            Prefix: requestDto.Prefix,
            Phone: requestDto.Phone,
            Email: requestDto.Email ? requestDto.Email : null,
            UserName: requestDto.UserName,
            Password: requestDto.Password,
        };

        var user = await this._userRepo.create(entity);
        if (user == null) {
            return null;
        }

        if (requestDto.hasOwnProperty('GenerateLoginOTP') && requestDto.GenerateLoginOTP === true) {
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

    public getById = async (id: string): Promise<UserDTO> => {
        return await this._userRepo.create(id);
    };

    public search = async (
        filters: UserSearchFilters,
        full: boolean = false
    ): Promise<UserDTO[] | UserDTOLight[]> => {
        if (full) {
            return await this._userRepo.searchFull(filters);
        } else {
            return await this._userRepo.searchLight(filters);
        }
    };

    public loginWithPassword = async (loginObject: UserLoginRequestDTO): Promise<any> => {

        var user: UserDTO = null;

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

    // resetPassword = async (obj: any): Promise<boolean> => {
    //     return true;
    // };

    public generateOtp = async (obj: any): Promise<boolean> => {

        var user: UserDTO = null;

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
        var currDate = DateTime.fromJSDate(new Date());
        var validTo = currDate.plus({ seconds: 300 }).toJSDate();

        var entity = await OTP.create({
            Purpose: purpose,
            UserId: user.id,
            OTP: otp,
            ValidFrom: Date.now(),
            ValidTo: validTo
        });

        var systemPhoneNumber = process.env.SYSTEM_PHONE_NUMBER;
        var message = `Hello ${user.FirstName}, ${otp} is OTP for your REANCare account. This OTP will expire in 3 minutes. If you have not requested this OTP, please contact REANCare support.`;
        await MessageService.SendMessage_SMS(user.PhoneNumber, message, systemPhoneNumber);
        return { Success: true };
    };

    public loginWithOtp = async (loginObject: UserLoginRequestDTO): Promise<any> => {
        return true;
    };

    // public addUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

    //     return true;
    // }

    // public deleteUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

    //     return true;
    // }

    // public getUserDeviceDetails = async(phone:string, email:string, userId:string): Promise<boolean> => {

    //     return true;
    // }
}
