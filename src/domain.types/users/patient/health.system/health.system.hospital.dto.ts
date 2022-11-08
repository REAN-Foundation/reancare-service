import { uuid } from "../../../miscellaneous/system.types";

export interface HealthSystemHospitalDto {
    id?             : uuid,
    HealthSystemId? : uuid;
    Name?           : string;
}