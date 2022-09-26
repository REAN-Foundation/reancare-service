import { uuid } from "../../../miscellaneous/system.types";

export interface CarePlanDto {
    id              : uuid;    //REANCare Care-plan isntance id
    PatientUserId   : uuid;
    RegistrationId  : string;  //This is the id of the patient with care-plan-provider-serive
    EnrollmentId?   : string;  //This is the enrollemnt id with care-plan-provider-serive
    CarePlanType    : string;  //Medical-Condition-specific, Post-Surgery, etc...
    Provider        : string;  //AHA
    PlanName        : string;  //AHA-HF
    PlanCode        : string;  //Code of the care-plan from the provider
    RegistrationDate: Date;
    StartDate       : Date;
    EndDate?        : Date;
    Description?    : string;
}
