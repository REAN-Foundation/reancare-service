import { uuid } from "../../miscellaneous/system.types";

export interface VisitDto {
    id?                        : uuid;
    VisitType?                 : string;
    EhrId?                     : string;
    DisplayId?                 : string;
    PatientUserId              : uuid;
    MedicalPractitionerUserId? : uuid;
    ReferenceVisitId?          : uuid;
    CurrentState?              : string;
    StartDate?                 : Date;
    EndDate?                   : Date;
    FulfilledAtOrganizationId? : uuid;
    AdditionalInformation?     : string;
}
