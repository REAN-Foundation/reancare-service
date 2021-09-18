import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface HeartPointsDto {
    id?          : string;
    EhrId?       : string;
    PersonId     : string;
    Person       : PersonDto;
    PatientUserId: string;
    PatientId?   : string;
    HeartPoints  : number;
    Unit         : string;
    RecordDate?  : Date;
}
