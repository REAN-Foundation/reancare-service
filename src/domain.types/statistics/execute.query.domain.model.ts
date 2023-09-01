import { uuid } from "../miscellaneous/system.types";
export interface ExecuteQueryDomainModel {
  Name         : string;
  Format?      : string;
  Description? : string;
  UserId?      : uuid;
  TenantId?    : uuid;
}
