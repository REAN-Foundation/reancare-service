import { PersonDto } from "../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface BloodOxygenSaturationDto {
    id?: string;
    EhrId?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    BloodOxygenSaturation: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
