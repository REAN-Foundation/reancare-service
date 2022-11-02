import { uuid } from "../../../miscellaneous/system.types";

export interface HealthSystemHospitalDomainModel {
    id?             : uuid,
    HealthSystemId? : uuid;
    Name?           : string;
}
