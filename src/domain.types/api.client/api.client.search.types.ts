import { ApiClientDto } from "./api.client.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface ApiClientSearchFilters {
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

export interface ApiClientSearchResults {
    TotalCount     : number;
    RetrievedCount : number;
    PageIndex      : number;
    ItemsPerPage   : number;
    Order          : string;
    OrderedBy      : string;
    Items          : ApiClientDto[];
}
