import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { SymptomsProgress } from "./symptom.progress.types";

export interface HowDoYouFeelDomainModel {
    id?           : uuid,
    EhrId?        : string;
    PatientUserId?: uuid;
    Feeling?      : SymptomsProgress | string;
    Comments?     : string;
    RecordDate?   : Date;
}
