import { uuid } from "../../../miscellaneous/system.types";

export interface StandDomainModel {
    id?           : uuid;
    PatientUserId : uuid;
    Stand         : number;
    Unit          : string;
    RecordDate?   : Date;
}
