import { SymptomsProgress } from "./symptom.progress.types";

export interface HowDoYouFeelDto {
    id?           : string,
    EhrId?        : string;
    PatientUserId?: string;
    Feeling?      : SymptomsProgress;
    Comments?     : string;
    RecordDate?   : Date;
}
