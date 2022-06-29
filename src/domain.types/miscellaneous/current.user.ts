import { uuid } from "./system.types";

export interface CurrentUser {
    UserId        : string;
    DisplayName   : string;
    Phone         : string;
    Email         : string;
    UserName      : string;
    CurrentRoleId : number;
    SessionId?    : uuid;
}
