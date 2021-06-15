import { String } from 'aws-sdk/clients/iot';
import { DateRangeUnit } from 'aws-sdk/clients/securityhub';
import { DateImported } from 'aws-sdk/clients/transfer';
import { UserRoleDto } from './role.domain.types';
import { UserDto } from './user.domain.types';
///////////////////////////////////////////////////////////////////////////////////////

export interface PatientDto {
    id: string;
    UserName: string;
    Prefix: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: string;
    BirthDate: Date;
    Age: string;
    ImageResourceId: string;
    Roles: UserRoleDto[];
    IsActive: boolean;
    ActiveSince: Date;
    LastLogin: Date;
};

export interface PatientDtoLight {
    id: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: string;
    BirthDate: Date;
};

export interface PatientSearchFilters {
    Phone: string;
    Email: string;
    UserId: string;
    Name: string;
    Gender: string;
    BirthdateFrom: Date;
    BirthdateTo: Date;
    CreatedDateFrom: Date;
    CreatedDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
};

export interface PatientDomainModel {
    id: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: string;
    BirthDate: Date;
};
