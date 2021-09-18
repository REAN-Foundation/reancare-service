import { FileResourceDto } from "./file.resource.dto";

//////////////////////////////////////////////////////////////////////

export interface FileResourceSearchFilters {
    FileName?: string;
    OwnerUserId?: string;
    UploadedByUserId?: string;
    IsPublic?: string;
    SiblingResourceId?: string;
    ReferenceItemId?: string;
    MimeType?: string;
    MetaSearchTags: string[];
    SizeInKBFrom: number;
    SizeInKBTo: number;
    UploadedDateFrom: Date;
    UploadedDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface FileResourceSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: FileResourceDto[];
}
