import { Gender } from '../../common/system.types';
import { AddressDomainModel, AddressDto } from './address.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Enums

export enum OrganizationTypes {
    Clinic = 'Clinic',
    Hospital = 'Hospital',
    DiagnosticLab = 'DiagnosticLab',
    Pharmacy = 'Pharmacy',
    AmbulanceService = 'AmbulanceService',
    Unknown = 'Unknown'
}

//#endregion

//#region Domain models

export interface OrganizationDomainModel {
    Type: string;
    Name: string;
    ContactPhone?: string;
    ContactEmail?: string;
    AboutUs?: string;
    OperationalSince?: string;
    ParentOrganizationId?: string;
    MainAddress?: AddressDomainModel;
    LogoImageResourceId?: string;
    IsHealthFacility?: boolean;
    NationalHealthFacilityRegistryId?: string;
}

//#endregion

//#region DTOs

export interface OrganizationDetailsDto {
    id: string;
    Type: string;
    Name: string;
    ContactPhone?: string;
    ContactEmail?: string;
    AboutUs?: string;
    OperationalSince?: string;
    ParentOrganizationId?: OrganizationDetailsDto;
    MainAddress?: AddressDto;
    LogoImageResourceId?: string;
    IsHealthFacility?: boolean;
    NationalHealthFacilityRegistryId?: string;
};

export interface OrganizationDto {
    id: string;
    Type: string;
    Name: string;
    ContactPhone?: string;
    ContactEmail?: string;
    AboutUs?: string;
    OperationalSince?: string;
};

//#endregion

//#region Search filters

export interface OrganizationSearchFilters {
    ContactPhone?: string;
    ContactEmail?: string;
    Name?: string;
    Gender: Gender;
    OperationalSinceFrom: Date;
    OperationalSinceTo: Date;
    CreatedDateFrom: Date;
    CreatedDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
};

//#endregion
