import { uuid } from "../../miscellaneous/system.types";

export interface CustomQueryDto {
  id?          : string;
  Name?        : string;
  Query?       : string;
  Format?      : string;
  Description? : string;
  Tags?        : string[];
  UserId?      : uuid;
  TenantId?    : uuid;
}
