import { Gender } from '../../common/system.types';
import { AddressDomainModel, AddressDto } from './address.domain.types';
import { OrganizationDetailsDto } from './organization.domain.types';
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
    Address: AddressDomainModel;
};

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
};

export interface PatientInsuranceDomainModel {
    id?: string;
    InsuranceProvider?: string;
    InsurancePolicyCode?: string;
    ValidFrom?: string;
    ValidTill?: string;
};
 
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
};

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
    Address?: AddressDto;
};

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
};

export interface PatientInsuranceDto {
    id?: string;
    InsuranceProvider?: string;
    InsurancePolicyCode?: string;
    ValidFrom?: string;
    ValidTill?: string;
};
 
export interface EmergencyContactDto {
    id?: string;
    Person: PersonDetailsDto;
    PatientUserId: string;
    Address?: AddressDto;
    Organization?: OrganizationDetailsDto;
    IsAvailableForEmergency?: boolean;
    Role: RoleDto;
    Relation?: string;
    TimeOfAvailability?: string;
    Description?: string;
    AdditionalPhoneNumbers?: string;
};

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
};

//#endregion

//#region  Search filters

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
};

//#endregion
