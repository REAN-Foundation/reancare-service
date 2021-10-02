import { PersonDomainModel } from '../../person/person.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface UserDomainModel {
    id?: string;
    Person: PersonDomainModel;
    UserName?: string;
    Password?:string;
    DefaultTimeZone?:string;
    CurrentTimeZone?:string;
    GenerateLoginOTP?:boolean;
    LastLogin?: Date;
    RoleId?: number;
}

export interface UserLoginDetails {
    Phone?: string,
    Email?: string,
    UserName?: string;
    Password?: string,
    Otp?: string,
    LoginRoleId: number
}

export interface UserExistanceModel {
    Phone?: string,
    Email?: string,
    UserName?: string;
    RoleId: number
}
