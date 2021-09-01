import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface BloodPressureDto {
    id?: string;
    EhrId?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    Systolic: number;
    Diastolic: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
