import { String } from 'aws-sdk/clients/iot';
import { DateRangeUnit } from 'aws-sdk/clients/securityhub';
import { DateImported } from 'aws-sdk/clients/transfer';
import { Gender } from '../../common/system.types';
import { UserRoleDto } from './role.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

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
    GenerateLoginOTP?:boolean;
}

export interface UserDto {
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
};

export interface UserDtoLight {
    id: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;
};

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

export interface UserLoginRequestDto {
    Phone?: string,
    Email?: string,
    Password?: string,
    Otp?: string,
    LoginRoleId: number
};

