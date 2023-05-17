import { EventStatus, EventType, TerraUser } from './webhook.event';

///////////////////////////////////////////////////////////////////////////////////////

export interface ReAuthDomainModel {
    Status            : EventStatus;
    Type              : EventType;
    OldUser           : TerraUser;
    NewUser           : TerraUser;
    Message           : string;
    Version           : Date;
}

export interface DeAuthDomainModel {
    Status            : EventStatus;
    Type              : EventType;
    User              : TerraUser;
    Message           : string;
    Version           : Date;
}
