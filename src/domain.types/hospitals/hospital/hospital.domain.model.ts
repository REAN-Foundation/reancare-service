import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface HospitalDomainModel {
    id            ?: uuid,
    HealthSystemId?: uuid;
    Name          ?: string;
    Tags          ?: string[];
}
