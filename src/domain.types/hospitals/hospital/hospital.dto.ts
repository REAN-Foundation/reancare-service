import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface HospitalDto {
    id?              : uuid,
    HealthSystemId?  : uuid;
    HealthSystemName?: string;
    Name             : string;
    Tags?            : string[];
    CreatedAt?       : Date;
}
