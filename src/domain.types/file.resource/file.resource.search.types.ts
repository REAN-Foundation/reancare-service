import { FileResourceDto } from "./file.resource.dto";

//////////////////////////////////////////////////////////////////////

export interface FileResourceSearchFilters {
    OwnerUserId?     : string,
    UploadedByUserId?: string,
    IsPublicResource?: boolean;
    ReferenceId?     : string;
    ReferenceType?   : string;
    ReferenceKeyword?: string;
    Tag?             : string;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    OrderBy?         : string;
    Order?           : string;
    PageIndex?       : number;
    ItemsPerPage?    : number;
}

export interface FileResourceSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : FileResourceDto[];
}
