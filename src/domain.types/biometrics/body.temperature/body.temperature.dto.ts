import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface BodyTemperatureDto {
    id?: string;
    EhrId?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    BodyTemperature: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
