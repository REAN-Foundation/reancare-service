import { String } from 'aws-sdk/clients/iot';
import { Gender } from '../../common/system.types';
import { AddressDto } from './address.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface PatientDomainModel {
    id?: string;
    UserId?: string;
    DisplayId?: string,
    NationalHealthId?:string;
    MedicalProfileId?: string;
    InsuranceIds?: String[];
    EmergencyContactIds?: string[];

    DisplayName?: string;
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    Prefix?: string;
    Phone?: string;
    Email?: string;
    Gender?: Gender;
    BirthDate?: Date;
    ActiveSince?: Date;
    ImageResourceId?:string;
    DefaultTimeZone?:string;
    CurrentTimeZone?:string;
};

export interface PatientMedicalProfileDomainModel {

};

export interface PatientInsuranceDomainModel {

};

export interface PatientEmergencyContactDomainModel {

};

//#endregion

//#region DTOs

export interface PatientDetailsDto {
    id: string;
    UserId: string;
    UserName: string;
    DisplayId: string;
    DisplayName: string;
    Prefix: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;
    Age: string;
    ImageResourceId: string;
    IsActive: boolean;
    ActiveSince: Date;
    LastLogin: Date;
    DefaultTimeZone:string;
    CurrentTimeZone:string;
    Address?: AddressDto;
    MedicalProfile?: PatientMedicalProfileDto;
    Insurances?: PatientInsuranceDto[];
    EmergencyContacts?: PatientEmergencyContactDto[];
};

export interface PatientMedicalProfileDto{

};

export interface PatientInsuranceDto {

};

export interface PatientEmergencyContactDto {

};

export interface PatientDto {
    id: string;
    UserId: string;
    DisplayId: string;
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
