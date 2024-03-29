import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { PersonDomainModel } from '../../person/person.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface UserDomainModel {
    id              ?: string;
    Person          ?: PersonDomainModel;
    TenantId        ?: uuid;
    TenantCode      ?: string;
    UserName        ?: string;
    Password        ?: string;
    DefaultTimeZone ?: string;
    CurrentTimeZone ?: string;
    IsTestUser      ?: boolean;
    GenerateLoginOTP?: boolean;
    LastLogin       ?: Date;
    RoleId          ?: number;
}

export interface UserLoginDetails {
    Phone      ?: string,
    Email      ?: string,
    UserName   ?: string;
    Password   ?: string,
    Otp        ?: string,
    LoginRoleId?: number,
    TenantId   ?: uuid,
    TenantCode ?: string,
}

export interface UserExistanceModel {
    Phone     ?: string,
    Email     ?: string,
    UserName  ?: string;
    RoleId     : number,
    TenantId  ?: uuid,
    TenantCode?: string,
}
