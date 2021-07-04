import { Gender } from '../../common/system.types';
import { PersonDetailsDto, PersonDomainModel, PersonDto } from './person.domain.types';

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
    UserName: string;
    LastLogin: Date;
    DefaultTimeZone:string;
    CurrentTimeZone:string;
};

export interface UserDto {
    id: string;
    Person: PersonDto
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
