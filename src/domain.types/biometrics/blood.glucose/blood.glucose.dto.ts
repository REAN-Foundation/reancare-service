import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface BloodGlucoseDto {
    id?: string;
    EhrId?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    BloodGlucose: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
