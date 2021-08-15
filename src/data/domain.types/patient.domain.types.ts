import { Gender } from '../../common/system.types';
import { AddressDomainModel, AddressDto } from './address.domain.types';
import { OrganizationDto } from './organization.domain.types';
import { PersonDetailsDto } from './person.domain.types';
import { RoleDto } from './role.domain.types';
import { UserDomainModel, UserDto } from './user.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface PatientDomainModel {
    id?: string;
    UserId?: string;
    PersonId?: string;
    DisplayId?: string,
    EhrId?: string;
    NationalHealthId?:string;
    MedicalProfileId?: string;
    User?: UserDomainModel;
    InsuranceIds?: string[];
    EmergencyContactIds?: string[];
    AddressIds: string[];
    Addresses?: AddressDomainModel[];
}

export interface MedicalProfileDomainModel {
    id?: string;
    PatientUserId?: string;
    BloodGroup?: string;
    MajorAilment?: string;
    OtherConditions?: string;
    IsDiabetic?: boolean;
    HasHeartAilment?: boolean;
    MaritalStatus?: string;
    Ethnicity?: string;
    Nationality?: string;
    Occupation?: string;
    SedentaryLifestyle?: boolean;
    IsSmoker?: boolean;
    SmokingSeverity?: string;
    SmokingSince?: Date;
    IsDrinker?: boolean;
    DrinkingSeverity?: string;
    DrinkingSince?: Date;
    SubstanceAbuse?: boolean;
    ProcedureHistory?: string;
    ObstetricHistory?: string;
    OtherInformation?: string;
}

export interface PatientInsuranceDomainModel {
    id?: string;
    InsuranceProvider?: string;
    InsurancePolicyCode?: string;
    ValidFrom?: string;
    ValidTill?: string;
}
 
export interface EmergencyContactDomainModel {
    id?: string;
    PersonId: string;
    PatientUserId: string;
    AddressId?: string;
    OrganizationId?: string;
    IsAvailableForEmergency?: boolean;
    RoleId?: string;
    Relation?: string;
    TimeOfAvailability?: string;
    Description?: string;
    AdditionalPhoneNumbers?: string;
}

//#endregion

//#region DTOs

export interface PatientDetailsDto {
    id: string;
    User: UserDto;
    DisplayId: string,
    EhrId?: string;
    NationalHealthId?:string;
    MedicalProfile?: MedicalProfileDto;
    Insurances?: PatientInsuranceDto[];
    EmergencyContacts?: EmergencyContactDto[];
    Addresses?: AddressDto[];
}

export interface MedicalProfileDto {
    id: string;
    PatientUserId?: string;
    BloodGroup?: string;
    MajorAilment?: string;
    OtherConditions?: string;
    IsDiabetic?: boolean;
    HasHeartAilment?: boolean;
    MaritalStatus?: string;
    Ethnicity?: string;
    Nationality?: string;
    Occupation?: string;
    SedentaryLifestyle?: boolean;
    IsSmoker?: boolean;
    SmokingSeverity?: string;
    SmokingSince?: Date;
    IsDrinker?: boolean;
    DrinkingSeverity?: string;
    DrinkingSince?: Date;
    SubstanceAbuse?: boolean;
    ProcedureHistory?: string;
    ObstetricHistory?: string;
    OtherInformation?: string;
}

export interface PatientInsuranceDto {
    id?: string;
    InsuranceProvider?: string;
    InsurancePolicyCode?: string;
    ValidFrom?: string;
    ValidTill?: string;
}
 
export interface EmergencyContactDto {
    id?: string;
    Person: PersonDetailsDto;
    PatientUserId: string;
    Address?: AddressDto;
    Organization?: OrganizationDto;
    IsAvailableForEmergency?: boolean;
    Role: RoleDto;
    Relation?: string;
    TimeOfAvailability?: string;
    Description?: string;
    AdditionalPhoneNumbers?: string;
}

export interface PatientDto {
    id: string;
    UserId: string;
    DisplayId: string;
    EhrId: string;
    DisplayName: string;
    UserName: string,
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;
    Age: string;
}

//#endregion

//#region Search

export interface PatientSearchFilters {
    Phone: string;
    Email: string;
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

export interface PatientSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: PatientDto[];
}

export interface PatientDetailsSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: PatientDetailsDto[];
}

//#endregion
