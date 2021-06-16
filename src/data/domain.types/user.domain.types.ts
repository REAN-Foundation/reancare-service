import { Gender } from '../../common/system.types';
import { UserRoleDto } from './role.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface UserDomainModel {
    id?: string;
    UserName?: string;
    Password?:string;
    Prefix?: string;
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    DisplayName?: string;
    Phone: string;
    Email?: string;
    Gender?: Gender;
    BirthDate?: Date;
    ImageResourceId?: string;
    DefaultTimeZone?:string;
    CurrentTimeZone?:string;
    GenerateLoginOTP?:boolean;
}

export interface UserLoginDetails {
    Phone?: string,
    Email?: string,
    Password?: string,
    Otp?: string,
    LoginRoleId: number
};

//#endregion

//#region DTOs
export interface UserDetailsDto {
    id: string;
    UserName: string;
    Prefix: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;
    Age: string;
    ImageResourceId: string;
    Roles: UserRoleDto[];
    IsActive: boolean;
    ActiveSince: Date;
    LastLogin: Date;
    DefaultTimeZone:string;
    CurrentTimeZone:string;
};

export interface UserDto {
    id: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;
};

//#endregion

//#region Search filters
export interface UserSearchFilters {
    Phone: string;
    Email: string;
    UserId: string;
    Name: string;
    Gender: Gender;
    BirthdateFrom: Date;
    BirthdateTo: Date;
    CreatedDateFrom: Date;
    CreatedDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
};

//#endregion
