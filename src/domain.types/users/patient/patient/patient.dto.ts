import { Gender, uuid } from "../../../miscellaneous/system.types";
import { EmergencyContactDto } from "../emergency.contact/emergency.contact.dto";
import { UserDetailsDto } from "../../user/user.dto";
import { HealthProfileDto } from "../health.profile/health.profile.dto";
import { PatientInsuranceDto } from "../insurance/insurance.dto";

/////////////////////////////////////////////////////////////////////////////////////////////

export interface PatientDto {
    id               : uuid;
    UserId           : uuid;
    DisplayId        : string;
    EhrId            : string;
    TenantId?        : uuid;
    CohortId?        : uuid;
    DonorAcceptance  : string;
    IsRemindersLoaded: boolean;
    TerraUserId      : string;
    FirstName        : string;
    LastName         : string;
    DisplayName      : string;
    UserName         : string,
    Phone            : string;
    Email            : string;
    Gender           : Gender;
    BirthDate        : Date;
    Age              : string;
    ImageResourceId? : uuid;
}

export interface PatientDetailsDto {
    id                  : uuid;
    UserId              : uuid;
    User                : UserDetailsDto;
    DisplayId           : string,
    EhrId?              : string;
    CohortId?           : uuid;
    NationalHealthId?   : string;
    HealthSystem?       : string;
    AssociatedHospital? : string;
    DonorAcceptance?    : string;
    IsRemindersLoaded?  : boolean;
    TerraUserId?        : string;
    TerraProvider?      : string;
    TerraScopes?        : string;
    FirstName?          : string;
    HealthProfile?      : HealthProfileDto;
    Insurances?         : PatientInsuranceDto[];
    EmergencyContacts?  : EmergencyContactDto[];
    CreatedAt?          : Date;
    UpdatedAt?          : Date;
}
