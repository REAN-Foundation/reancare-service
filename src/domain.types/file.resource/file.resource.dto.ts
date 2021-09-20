import { ResourceReferenceItem, SiblingResource } from "./file.resource.types";

export interface FileResourceDto {
    id?              : string;
    EhrId?           : string;
    FileName?        : string;
    OwnerUserId?     : string;
    Version?         : string;
    UploadedByUserId?: string;
    StorageKey?      : string;
    IsPublic?        : boolean;
    SiblingResources?: SiblingResource[];
    ReferenceItems?  : ResourceReferenceItem[];
    MimeType?        : string;
    MetaInformation? : string;
    SizeInKB?        : number;
    UploadedDate?    : Date;
    PublicUrl?       : string;
    AuthUrl?         : string;
}

export interface DownloadedFilesDetailsDto {
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
    StorageKey          : string;
    DownloadedLocalPath?: string;
}
