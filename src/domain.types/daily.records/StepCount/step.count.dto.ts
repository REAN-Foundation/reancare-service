import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface StepCountDto {
    id?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    StepCount: number;
    Unit: string;
    RecordDate?: Date;
}
