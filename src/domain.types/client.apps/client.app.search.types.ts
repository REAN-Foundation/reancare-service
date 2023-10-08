import { ClientAppDto } from "./client.app.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface ClientAppSearchFilters {
    ClientName   : string;
    ClientCode?  : string;
    Phone?       : string;
    Email?       : string;
    ValidFrom?   : Date;
    ValidTill?   : Date;
    OrderBy      : string;
    Order        : string;
    PageIndex    : number;
    ItemsPerPage : number;
}

export interface ClientAppSearchResults {
    TotalCount     : number;
    RetrievedCount : number;
    PageIndex      : number;
    ItemsPerPage   : number;
    Order          : string;
    OrderedBy      : string;
    Items          : ClientAppDto[];
}
