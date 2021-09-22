import { FileResourceMetadata, ResourceReference } from "./file.resource.types";

export interface FileResourceDetailsDto {
    id?              : string;
    FileName?        : string;
    OwnerUserId?     : string;
    UploadedByUserId?: string;
    IsPublicResource?: boolean;
    MimeType?        : string;
    LatestVersion    : FileResourceMetadata;
    Versions?        : FileResourceMetadata[];
    References?      : ResourceReference[];
    Tags?            : string[];
}

export interface FileResourceDto {
    id?              : string;
    FileName?        : string;
    OwnerUserId?     : string;
    IsPublicResource?: boolean;
    MimeType?        : string;
    LatestVersion    : FileResourceMetadata;
}

export interface SearchFilesDetailsDto {
    LocalFolderName : string;
    Files           : FileVersionDetailsDto[];
    ReferenceItemId : string;
    ReferenceType   : string;
    ReferenceKeyword: string;
    Tag             : string;
}

export interface FileVersionDetailsDto {
    id                  : string;
    FileName            : string;
    OriginalName        : string;
    Version             : string;
    StorageKey?         : string;
    MimeType            : string;
    PublicUrl?          : string;
    AuthUrl?            : string;
    UploadedDate?       : Date;
    DownloadedLocalPath?: string;
}
