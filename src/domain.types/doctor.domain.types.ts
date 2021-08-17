import { Gender } from '../common/system.types';
import { AddressDomainModel, AddressDto } from './address.domain.types';
import { HealthcareServiceSchedule } from './healthcare.service.domain.types';
import { OrganizationDto } from './organization.domain.types';
import { UserDomainModel, UserDto } from './user.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface DoctorDomainModel {
    id?: string;
    UserId?: string;
    PersonId?: string;
    DisplayId?: string,
    EhrId?: string;
    NationalDigiDoctorId?:string;
    User?: UserDomainModel;
    About?: string;
    Locality?: string;
    Qualifications?: string;
    Specialities?: string[];
    PractisingSince?: Date;
    ProfessionalHighlights?: string[];
    AvailabilitySchedule?: HealthcareServiceSchedule;
    ConsultationFee?: number;
    AddressIds?: string[];
    Addresses?: AddressDomainModel[];
    OrganizationIds?: string[];
}

//#endregion

//#region DTOs

export interface DoctorDetailsDto {
    id: string;
    DisplayId: string,
    EhrId?: string;
    NationalDigiDoctorId?:string;
    User: UserDto;
    Locality?: string;
    Qualifications?: string;
    Specialities?: string[];
    About?: string;
    PractisingSince?: Date;
    ProfessionalHighlights?: string[];
    AvailabilitySchedule?: HealthcareServiceSchedule;
    ConsultationFee?: number;
    Addresses?: AddressDto[];
    Organizations?: OrganizationDto[];
}

export interface DoctorDto {
    id: string;
    UserId: string;
    DisplayId: string;
    EhrId: string;
    DisplayName: string;
    UserName: string,
    NationalDigiDoctorId: string;
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;
    Age: string;
    Specialities?: string[];
}

//#endregion

//#region Search

export interface DoctorSearchFilters {
    Phone?: string;
    Email?: string;
    Name?: string;
    Gender?: Gender;
    PractisingSinceFrom?: Date;
    PractisingSinceTo?: Date;
    Locality?: string;
    Qualifications?: string;
    Specialities?: string;
    ProfessionalHighlights?: string;
    ConsultationFeeFrom?: number;
    ConsultationFeeTo?: number;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface DoctorSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DoctorDto[];
}

export interface DoctorDetailsSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DoctorDetailsDto[];
}

//#endregion
