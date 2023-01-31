import { AddressDto } from "../../general/address/address.dto";
import { HealthcareServiceSchedule } from "../../healthcare.service/healthcare.service.domain.types";
import { Gender } from "../../miscellaneous/system.types";
import { OrganizationDto } from "../../general/organization/organization.dto";
import { UserDto } from "../user/user.dto";

/////////////////////////////////////////////////////////////////////////////

export interface DoctorDetailsDto {
    id                     : string;
    DisplayId              : string,
    EhrId?                 : string;
    UserId?                : string;
    NationalDigiDoctorId?  : string;
    User                   : UserDto;
    Locality?              : string;
    Qualifications?        : string;
    Specialities?          : string[];
    About?                 : string;
    PractisingSince?       : Date;
    ProfessionalHighlights?: string[];
    AvailabilitySchedule?  : HealthcareServiceSchedule;
    ConsultationFee?       : number;
    Addresses?             : AddressDto[];
    Organizations?         : OrganizationDto[];
}

export interface DoctorDto {
    id                  : string;
    UserId              : string;
    DisplayId           : string;
    EhrId               : string;
    DisplayName         : string;
    UserName            : string,
    NationalDigiDoctorId: string;
    Phone               : string;
    Email               : string;
    Gender              : Gender;
    BirthDate           : Date;
    Age                 : string;
    Specialities?       : string[];
}
