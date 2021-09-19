import { FileResourceDto } from "./file.resource.dto";

//////////////////////////////////////////////////////////////////////

export interface FileResourceSearchFilters {
    OwnerUserId?     : string,
    IsPublicResource?: boolean;
    Version?         : string;
    ReferenceId?     : string;
    ReferenceType?   : string;
    Tag              : string;
    CreatedDateFrom  : Date;
    CreatedDateTo    : Date;
    OrderBy          : string;
    Order            : string;
    PageIndex        : number;
    ItemsPerPage     : number;
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
