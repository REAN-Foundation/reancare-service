import { String } from 'aws-sdk/clients/iot';
import { DateRangeUnit } from 'aws-sdk/clients/securityhub';
import { DateImported } from 'aws-sdk/clients/transfer';
import { UserRoleDTO } from './role.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface UserDTO {
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
    Roles: UserRoleDTO[];
    IsActive: boolean;
    ActiveSince: Date;
    LastLogin: Date;
};

export interface UserDTOLight {
    id: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: string;
    BirthDate: Date;
};

export interface UserSearchFilters {
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

export interface UserLoginRequestDTO {
    Phone?: string,
    Email?: string,
    Password?: string,
    Otp?: string,
    LoginRoleId: number
};
