import { uuid } from "../../miscellaneous/system.types";

export interface HealthSystemDomainModel {
    id?   : uuid,
    TenantId? : string,
    Name? : string;
    Tags? : string[]
}
