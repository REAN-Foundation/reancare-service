import { UserDto } from "../../users/user/user.dto";
import { uuid } from "../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";

/////////////////////////////////////////////////////////////////////////////////////////////

export enum OrganizationTypes {
    Clinic                            = 'Clinic',
    Hospital                          = 'Hospital',
    DiagnosticLab                     = 'Diagnostic Lab',
    DiagnosticLab_Pathology           = 'Diagnostic Lab - Pathology',
    DiagnosticLab_Imaging             = 'Diagnostic Lab - Imaging',
    Pharmacy                          = 'Pharmacy',
    AmbulanceService                  = 'Ambulance Service',
    GovernmentPrimaryHealthCareCentre = 'Government Primary Health Care Centre',
    GovernmentNodalHospital           = 'Government Nodal Hospital',
    GovernmentDistrictHospital        = 'Government District Hospital',
    MunicipalHospital                 = 'Municipal Hospital',
    BloodBank                         = 'Blood Bank',
    NursingHome                       = 'Nursing Home',
    SpecializedCareCentre             = 'Specialized Care Centre',
    AmbulatoryProcedureCentre         = 'Ambulatory Procedure Centre',
    SocialHealth                      = 'Social Health',
    Unknown                           = 'Unknown'
}

export const OrganizationTypeList: OrganizationTypes [] = [
    OrganizationTypes.Clinic,
    OrganizationTypes.Hospital,
    OrganizationTypes.DiagnosticLab,
    OrganizationTypes.DiagnosticLab_Pathology,
    OrganizationTypes.DiagnosticLab_Imaging,
    OrganizationTypes.Pharmacy,
    OrganizationTypes.AmbulanceService,
    OrganizationTypes.GovernmentPrimaryHealthCareCentre,
    OrganizationTypes.GovernmentNodalHospital,
    OrganizationTypes.GovernmentDistrictHospital,
    OrganizationTypes.MunicipalHospital,
    OrganizationTypes.BloodBank,
    OrganizationTypes.NursingHome,
    OrganizationTypes.SpecializedCareCentre,
    OrganizationTypes.AmbulatoryProcedureCentre,
    OrganizationTypes.SocialHealth,
    OrganizationTypes.Unknown,
];

/////////////////////////////////////////////////////////////////////////////////////////////

export interface OrganizationDomainModel {
    id                              ?: uuid,
    Name                             : string;
    Type                             : string;
    ContactUserId                   ?: uuid;
    TenantId                        ?: uuid;
    ContactPhone                    ?: string;
    ContactEmail                    ?: string;
    About                           ?: string;
    ParentOrganizationId            ?: uuid;
    OperationalSince                ?: Date;
    ImageResourceId                 ?: uuid;
    IsHealthFacility                ?: boolean;
    NationalHealthFacilityRegistryId?: string;
    AddressIds                      ?: uuid[];
}

export interface OrganizationDto {

    id                              ?: uuid,
    TenantId                        ?: uuid;
    Type                            ?: string;
    Name                            ?: string;
    ContactUserId                   ?: uuid;
    ContactUser                     ?: UserDto;
    ContactPhone                    ?: string;
    ContactEmail                    ?: string;
    ParentOrganizationId            ?: uuid;
    About                           ?: string;
    OperationalSince                ?: Date;
    AddressIds                      ?: uuid[];
    ImageResourceId                 ?: uuid;
    IsHealthFacility                ?: boolean;
    NationalHealthFacilityRegistryId?: string;
}

export interface OrganizationSearchFilters extends BaseSearchFilters {
    Type                ?: string;
    Name                ?: string;
    ContactUserId       ?: uuid;
    ContactPhone        ?: string;
    ContactEmail        ?: string;
    OperationalSinceFrom : Date;
    OperationalSinceTo   : Date;
    CreatedDateFrom      : Date;
    CreatedDateTo        : Date;
}

export interface OrganizationSearchResults extends BaseSearchResults {
    Items: OrganizationDto[];
}
