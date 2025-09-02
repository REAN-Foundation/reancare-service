import { uuid } from "../../../miscellaneous/system.types";
import { VisitDto } from "../../visit/visit.dto";
import { PregnancyDto } from "../pregnancy/pregnancy.dto";

export interface AntenatalVisitDto {
    id?                    :uuid;
    VisitId?               : uuid;
    PregnancyId?           : uuid;
    PatientUserId?         : uuid;
    DateOfVisit?           : Date;
    GestationInWeeks?      : number;
    FetalHeartRateBPM?     : number;
    FundalHeight?          : JSON;
    DateOfNextVisit?       : Date;
    BodyWeightID?          : string;
    BodyTemperatureId?     : string;
    BloodPressureId?       : string;
    Visit?                 : VisitDto;
    Pregnancy?             :PregnancyDto;
}
