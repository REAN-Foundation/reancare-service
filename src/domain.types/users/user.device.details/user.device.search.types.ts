import { UserDeviceDetailsDto } from "./user.device.dto";

//////////////////////////////////////////////////////////////////////

export interface UserDeviceDetailsSearchFilters {
    UserId?       : string;
    Token?        : string;
    DeviceName?   : string;
    OSType?       : string;
    OSVersion?    : string;
    AppName?      : string;
    AppVersion?   : string;
    OrderBy?      : string;
    Order?        : string;
    PageIndex?    : number;
    ItemsPerPage? : number;
}

export interface UserDeviceDetailsSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : UserDeviceDetailsDto[];
}
