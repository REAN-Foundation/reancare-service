import { Gender } from '../../common/system.types';
import { PersonRoleDto } from './role.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Enums

export enum PersonIdentificationType {
    Aadhar = 'Aadhar',
    PassportNumber = 'PassportNumber',
    SocialSecurityNumber = "SocialSecurityNumber"
}

//#endregion

//#region Domain models

export interface PersonDomainModel {
    id?: string;
    Prefix?: string;
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    DisplayName?: string;
    Phone?: string;
    Email?: string;
    Gender?: Gender;
    BirthDate?: Date;
    ImageResourceId?: string;
}

//#endregion

//#region DTOs
export interface PersonDetailsDto {
    id: string;
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
    Roles: PersonRoleDto[];
    ActiveSince: Date;
}

export interface PersonDto {
    id: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;
}

//#endregion

//#region Search filters
export interface PersonSearchFilters {
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
}

//#endregion
