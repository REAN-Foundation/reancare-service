import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { PersonDomainModel } from '../../person/person.domain.model';
import { UserDetailsDto } from './user.dto';
import { SupportedLanguage } from './user.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface UserDomainModel {
    id                  ?: string;
    Person              ?: PersonDomainModel;
    TenantId            ?: uuid;
    TenantCode          ?: string;
    UserName            ?: string;
    Password            ?: string;
    DefaultTimeZone     ?: string;
    CurrentTimeZone     ?: string;
    IsTestUser          ?: boolean;
    PreferredLanguage   ?: SupportedLanguage;
    GenerateLoginOTP    ?: boolean;
    LastLogin           ?: Date;
    RoleId              ?: number;
}

export interface UserBasicDetails {
    Phone      ?: string,
    Email      ?: string,
    UniqueReferenceId ?: string,
    UserName   ?: string;
    TenantId   ?: uuid,
    TenantCode ?: string,
}

export interface UserLoginDetails extends UserBasicDetails {
    Password   ?: string,
    Otp        ?: string,
    LoginRoleId?: number,
}

export interface UserExistanceModel {
    Phone     ?: string,
    Email     ?: string,
    UserName  ?: string;
    RoleId     : number,
    TenantId  ?: uuid,
    TenantCode?: string,
}

export interface ChangePasswordModel {
    Phone       ?: string;
    Email       ?: string;
    UserName    ?: string;
    OldPassword  : string;
    NewPassword  : string;
    RoleId      ?: number;
}

export interface UserAccountActionResult {
    Success: boolean;
    User: UserDetailsDto;
}

export interface ResetPasswordModel {
    Phone      ?: string;
    Email      ?: string;
    UserName   ?: string;
    ResetCode   : string;
    NewPassword : string;
    RoleId     ?: number;
}

export interface SendPasswordResetCodeModel {
    Phone       ?: string;
    Email       ?: string;
    UserName    ?: string;
    RoleId      ?: number;
}

export interface OtpGenerationModel {
    Phone       ?: string;
    Email       ?: string;
    UserName    ?: string;
    UserId      ?: uuid;
    RoleId      ?: number;
    Purpose     ?: string;
    TenantId    ?: uuid;
    TenantCode  ?: string;
}
