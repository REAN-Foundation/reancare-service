import { uuid } from "../../miscellaneous/system.types";

export interface HealthSystemDto {
    id         : uuid,
    TenantId?    : uuid,
    Name       : string;
    Tags      ?: string[];
    CreatedAt? : Date;
}
