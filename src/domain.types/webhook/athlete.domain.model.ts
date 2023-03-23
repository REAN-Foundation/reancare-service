import { EventStatus, EventType, TerraUser } from "./webhook.event";

export interface AthleteDomainModel {
  Status            : EventStatus;
  Type              : EventType;
  User              : TerraUser;
  Data              : Athlete;
  Version           : Date;
}

export interface Athlete {
  Age         : number;
  Country     : string;
  Bio         : string;
  State       : string;
  LastName    : string;
  Sex         : string;
  City        : string;
  Email       : string;
  DateOfBirth : string;
  FirstName   : string;
  Gender      : string;
}
