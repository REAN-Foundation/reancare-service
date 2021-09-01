import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface BodyHeightDto {
    id?: string;
    EhrId?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    BodyHeight: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
