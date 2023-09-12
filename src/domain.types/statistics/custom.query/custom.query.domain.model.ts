import { uuid } from "../../miscellaneous/system.types";
export interface CustomQueryDomainModel {
  Name         : string;
  Format?      : string;
  Description? : string;
  UserId?      : uuid;
  TenantId?    : uuid;
}
