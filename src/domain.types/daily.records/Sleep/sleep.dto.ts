import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface SleepDto {
    id?          : string;
    PersonId     : string;
    Person       : PersonDto;
    PatientUserId: string;
    PatientId?   : string;
    SleepDuration: number;
    Unit         : string;
    RecordDate?  : Date;
}
