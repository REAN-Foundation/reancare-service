import { uuid } from "../../../miscellaneous/system.types";
import { DeliveryMode,DeliveryOutcome } from "../../../../domain.types/clinical/maternity/delivery/delivery.type";
import { PregnancyDto } from "../pregnancy/pregnancy.dto";

export interface DeliveryDto {
    id?                    : uuid;
    PregnancyId?           : uuid;
    PatientUserId?         : uuid;
    DeliveryDate?          : Date;
    DeliveryTime?          : string;
    GestationAtBirth?      : number;
    DeliveryMode?          : DeliveryMode;
    DeliveryPlace?         : string;
    DeliveryOutcome?       : DeliveryOutcome;
    DateOfDischarge?       : Date;
    OverallDiagnosis?      : string;
    Pregnancy?             : PregnancyDto;
}
