import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface HospitalDto {
    id?              : uuid,
    TenantId?        : uuid,
    HealthSystemId?  : uuid;
    HealthSystemName?: string;
    Name             : string;
    Tags?            : string[];
    CreatedAt?       : Date;
}
