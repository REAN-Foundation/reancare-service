import { Gender } from "../miscellaneous/system.types";
import { AddressDto } from "../address/address.dto";
import { EmergencyContactDto } from "../emergency.contact/emergency.contact.dto";
import { HealthProfileDto } from "../health.profile/health.profile.dto";
import { PatientInsuranceDto } from "../patient.insurance/patient.insurance.dto";
import { UserDto } from "../user/user.dto";

/////////////////////////////////////////////////////////////////////////////////////////////

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

export interface PatientDetailsDto {
    id: string;
    UserId: string;
    User: UserDto;
    DisplayId: string,
    EhrId?: string;
    NationalHealthId?:string;
    MedicalProfile?: HealthProfileDto;
    Insurances?: PatientInsuranceDto[];
    EmergencyContacts?: EmergencyContactDto[];
    Addresses?: AddressDto[];
}
