import { uuid } from "../../miscellaneous/system.types";

export interface CustomQueryDto {
  id         ?: string;
  Name         : string;
  Format?      : string;
  Description? : string;
  UserId?      : uuid;
  TenantId?    : uuid;
}
