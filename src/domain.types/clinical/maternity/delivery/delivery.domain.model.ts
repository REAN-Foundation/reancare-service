import { uuid } from "../../../miscellaneous/system.types";
import { DeliveryMode,DeliveryOutcome } from "../../../../domain.types/clinical/maternity/delivery/delivery.type";
import { PregnancyDomainModel } from "../pregnancy/pregnancy.domain.model";

export interface DeliveryDomainModel {
    id?                  : uuid;
    PregnancyId?         : uuid;
    PatientUserId?       : uuid;
    DeliveryDate?        : Date;
    DeliveryTime?        : string;
    GestationAtBirth?    : number;
    DeliveryMode?        : DeliveryMode;
    DeliveryPlace?       : string;
    DeliveryOutcome?     : DeliveryOutcome;
    DateOfDischarge?     : Date;
    OverallDiagnosis?    : string;
    Pregnancy?           : PregnancyDomainModel;
}
