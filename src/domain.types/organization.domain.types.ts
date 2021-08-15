import { AddressDto } from './address.domain.types';
import { UserDto } from './user.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Enums

export enum OrganizationTypes {
    Clinic = 'Clinic',
    Hospital = 'Hospital',
    DiagnosticLab = 'Diagnostic Lab',
    DiagnosticLab_Pathology = 'Diagnostic Lab - Pathology',
    DiagnosticLab_Imaging = 'Diagnostic Lab - Imaging',
    Pharmacy = 'Pharmacy',
    AmbulanceService = 'Ambulance Service',
    GovernmentPrimaryHealthCareCentre = 'Government Primary Health Care Centre',
    GovernmentNodalHospital = 'Government Nodal Hospital',
    GovernmentDistrictHospital = 'Government District Hospital',
    MunicipalHospital = 'Municipal Hospital',
    BloodBank = 'Blood Bank',
    NursingHome = 'Nursing Home',
    SpecializedCareCentre = 'Specialized Care Centre',
    AmbulatoryProcedureCentre = 'Ambulatory Procedure Centre',
    Unknown = 'Unknown'
}

//#endregion

//#region Domain models

export interface OrganizationDomainModel {
    id?: string,
    Type: string;
    Name: string;
    ContactUserId?: string;
    ContactPhone?: string;
    ContactEmail?: string;
    ParentOrganizationId?: string;
    About?: string;
    OperationalSince?: Date;
    AddressIds?: string[];
    ImageResourceId?: string;
    IsHealthFacility?: boolean;
    NationalHealthFacilityRegistryId?: string;
}

//#endregion

//#region DTOs

export interface OrganizationDto {
    id: string;
    Type: string;
    Name: string;
    ContactUser?: UserDto;
    ContactPhone?: string;
    ContactEmail?: string;
    ParentOrganization?: OrganizationDto;
    About?: string;
    OperationalSince?: Date;
    Addresses?: AddressDto[];
    ImageResourceId?: string;
    IsHealthFacility?: boolean;
    NationalHealthFacilityRegistryId?: string;
}

//#endregion

//#region Search

export interface OrganizationSearchFilters {
    Type?: string;
    Name?: string;
    ContactUserId?: string;
    ContactPhone?: string;
    ContactEmail?: string;
    OperationalSinceFrom: Date;
    OperationalSinceTo: Date;
    CreatedDateFrom: Date;
    CreatedDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface OrganizationSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: OrganizationDto[];
}

//#endregion
