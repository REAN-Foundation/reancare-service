import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface HospitalDto {
    id?             : uuid,
    HealthSystemId? : uuid;
    Name            : string;
    Tags?           : string[];
}
