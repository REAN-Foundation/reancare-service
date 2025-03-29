import { uuid } from "../../../miscellaneous/system.types";

///////////////////////////////////////////////////////////////////////

export interface AntenatalVisitDomainModel {
    id?                        : uuid;
    VisitId?                   : uuid;
    ExternalVisitId?           : string;
    PregnancyId?               : uuid;
    PatientUserId?             : uuid;
    DateOfVisit?               : Date;
    GestationInWeeks?          : number;
    FetalHeartRateBPM?         : number;
    FundalHeight       ?       : JSON;
    DateOfNextVisit?           : Date;
    BodyWeightID?              : uuid;
    BodyTemperatureId?         : uuid;
    BloodPressureId?           : uuid;
}
