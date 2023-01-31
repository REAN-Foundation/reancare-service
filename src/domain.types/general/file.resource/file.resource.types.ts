import { Stream } from "stream";

export interface ResourceReference {
    ItemId  : string;
    ItemType: string;
    Keyword : string;
}

export enum DownloadDisposition {
    Inline     = 'inline',
    Attachment = 'attachment',
    Stream     = 'stream',
    Auto       = 'auto',
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
    Disposition?     : DownloadDisposition;
    Url?             : string;
    Stream?          : Stream;
}
