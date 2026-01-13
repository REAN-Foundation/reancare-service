import { uuid } from "../../../miscellaneous/system.types";
import { VisitDomainModel } from "../../visit/visit.domain.model";
import { PregnancyDomainModel } from "../pregnancy/pregnancy.domain.model";

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
    FundalHeight?              : JSON;
    DateOfNextVisit?           : Date;
    BodyWeightID?              : uuid;
    BodyTemperatureId?         : uuid;
    BloodPressureId?           : uuid;
    Visit?                     : VisitDomainModel;
    Pregnancy?                 : PregnancyDomainModel;
}
