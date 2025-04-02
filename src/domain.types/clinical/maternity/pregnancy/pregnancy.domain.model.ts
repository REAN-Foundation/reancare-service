import { uuid } from "../../../miscellaneous/system.types";

export interface PregnancyDomainModel {
    id?                         : uuid;
    PatientUserId?              : uuid;
    ExternalPregnancyId?        : uuid;
    DateOfLastMenstrualPeriod?  : Date;
    EstimatedDateOfChildBirth?  : Date;
    Gravidity?                  : number;
    Parity?                     : number;
}
