import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface HeartPointsDomainModel {
    id?           : uuid;
    PatientUserId?: uuid;
    HeartPoints   : number;
    Unit          : string;
    RecordDate?   : Date;
}
