import { PersonDto } from "../../../person/person.dto";

///////////////////////////////////////////////////////////////////////////////

export interface CalorieBalanceDto {
    id?: string;
    PersonId: string;
    Person: PersonDto;
    PatientUserId: string;
    PatientId?: string;
    CaloriesConsumed: number;
    CaloriesBurned: number;
    CalorieBalance: number;
    Unit: string;
    RecordDate?: Date;
}
