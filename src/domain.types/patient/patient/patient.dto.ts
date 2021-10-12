import { Gender } from "../../miscellaneous/system.types";
import { EmergencyContactDto } from "../../patient/emergency.contact/emergency.contact.dto";
import { UserDto } from "../../user/user/user.dto";
import { HealthProfileDto } from "../health.profile/health.profile.dto";
import { PatientInsuranceDto } from "../insurance/insurance.dto";

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
    HealthProfile?: HealthProfileDto;
    Insurances?: PatientInsuranceDto[];
    EmergencyContacts?: EmergencyContactDto[];
}
