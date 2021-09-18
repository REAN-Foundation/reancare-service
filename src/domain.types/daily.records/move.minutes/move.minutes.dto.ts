import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface MoveMinutesDto {
    id?          : string;
    PersonId     : string;
    Person       : PersonDto;
    PatientUserId: string;
    PatientId?   : string;
    MoveMinutes  : number;
    Unit         : string;
    RecordDate?  : Date;
}
