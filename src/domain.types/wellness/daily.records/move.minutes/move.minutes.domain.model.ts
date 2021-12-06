import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface MoveMinutesDomainModel {
    id?          : uuid;
    PatientUserId: uuid;
    MoveMinutes  : number;
    Unit         : string;
    RecordDate?  : Date;
}
