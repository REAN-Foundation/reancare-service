import { uuid } from "./system.types";

export interface CurrentUser {
    UserId        : string;
    TenantId      : string;
    TenantCode    : string;
    TenantName    : string;
    DisplayName   : string;
    Phone         : string;
    Email         : string;
    UserName      : string;
    CurrentRoleId : number;
    CurrentRole   : string;
    SessionId?    : uuid;
}

export type RequestType = 'Create' | 'GetById' | 'Update' | 'Delete' | 'Search' | 'Get' | 'Other';
