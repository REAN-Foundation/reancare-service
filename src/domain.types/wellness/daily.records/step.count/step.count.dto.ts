//import { PersonDto } from "../../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface StepCountDto {
    id?           : string;
    PatientUserId?: string;
    TerraSummaryId? : string;
    Provider?       : string;
    StepCount?    : number;
    Unit?         : string;
    RecordDate    : Date;
}
