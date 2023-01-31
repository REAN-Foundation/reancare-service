import { uuid } from "../../miscellaneous/system.types";

export interface LabVisitDomainModel {
    id?              : uuid;
    DisplayId?       : string;
    DisplayEhrId?    : string;
    PatientUserId    : uuid;
    EhrId?           : uuid;
    LabAppointmentId : uuid;
    DoctorVisitId?   : string;
    DoctorVisitEhrId?: string;
    SuggestedLabId?  : uuid;
    CreatedBy        : uuid;
    CurrentState     : string;
}

