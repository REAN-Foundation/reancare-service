import { uuid } from "../../miscellaneous/system.types";
export interface CustomQueryDomainModel {
  id?          : uuid;
  Name         : string;
  Query        : string;
  Format?      : string;
  Description? : string;
  Tags?        : string[];
  UserId?      : uuid;
  TenantId?    : uuid;
}
