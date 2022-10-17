import { AddressDomainModel } from "../../general/address/address.domain.model";
import { Gender } from "../../miscellaneous/system.types";

export interface PharmacistDomainModel {
    id?: string;
    UserId?: string;
    DisplayId?: string,
    EhrId?: string;
    NationalHealthId?:string;
    MedicalProfileId?: string;

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

    InsuranceIds?: string[];
    EmergencyContactIds?: string[];

    Address?: AddressDomainModel;
}
