import { uuid } from "../../miscellaneous/system.types";

export interface WearableDeviceDetailsDto {
  id                : uuid;
  PatientUserId     : uuid;
  Provider          : string;
  TerraUserId       : uuid;
  Scopes            : string;
  AuthenticatedAt   : Date;
  DeauthenticatedAt : Date;
}
