import { uuid } from "../../miscellaneous/system.types";

export interface HealthSystemDomainModel {
    id?   : uuid,
    Name? : string;
    Tags? : string[]
}
