import { SymptomsProgress } from "./symptom.progress.types";

export interface HowDoYouFeelDomainModel {
    id?           : string,
    EhrId?        : string;
    PatientUserId?: string;
    Feeling?      : SymptomsProgress;
    Comments?     : string;
    RecordDate?   : Date;
}
