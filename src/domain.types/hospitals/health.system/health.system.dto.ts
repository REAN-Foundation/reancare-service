import { uuid } from "../../miscellaneous/system.types";

export interface HealthSystemDto {
    id         : uuid,
    Name       : string;
    Tags      ?: string[];
    CreatedAt? : Date;
}
