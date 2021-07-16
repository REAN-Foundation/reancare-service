import { Gender } from '../../common/system.types';
import { PersonDetailsDto, PersonDomainModel, PersonDto } from './person.domain.types';
import { RoleDto } from './role.domain.types'

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
    Password?: string,
    Otp?: string,
    LoginRoleId: number
};

//#endregion

//#region DTOs

export interface UserDetailsDto {
    id: string;
    Person: PersonDetailsDto;
    Role: RoleDto;
    UserName: string;
    DefaultTimeZone:string;
    CurrentTimeZone:string;
    LastLogin: Date;
};

export interface UserDto {
    id: string;
    Person: PersonDto;
    DefaultTimeZone:string;
    CurrentTimeZone:string;
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
