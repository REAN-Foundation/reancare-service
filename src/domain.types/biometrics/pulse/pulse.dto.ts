import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface PulseDto {
    id?: string;
    EhrId?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    Pulse: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
