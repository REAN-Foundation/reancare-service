import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface BodyWeightDto {
    id?: string;
    EhrId?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    BodyWeight: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
