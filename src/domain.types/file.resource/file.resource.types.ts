export interface ResourceReference {
    ItemId  : string;
    ItemType: string;
    Keyword : string;
}

export interface FileResourceMetadata {
    ResourceId?      : string;
    VersionId?       : string;
    Version?         : string;
    FileName?        : string;
    OriginalName?    : string;
    SourceFilePath?  : string;
    MimeType?        : string;
    Size?            : number;
    StorageKey?      : string;
    IsDefaultVersion?: boolean;
    IsPublicResource?: boolean;
}
