import * as express from 'express-fileupload';
import { ResourceReferenceItem } from "./file.resource.types";

export interface FileResourceUploadDomainModel {
    id?                    : string,
    Files?                 : express.FileArray;
    FileNames?             : string[];
    OwnerUserId?           : string;
    UploadedByUserId?      : string;
    IsPublicResource?      : boolean;
    IsMultiResolutionImage?: boolean;
    References?            : ResourceReferenceItem[];
    Tags?                  : string[];
    StorageKey             : string;
    MimeType?              : string;
    MetaInformation?       : string;
    SizeInKB?              : number;
    UploadedDate?          : Date;
}

export interface FileResourceVersionDomainModel {
    ResourceId?: string;
    Version?   : string;
    StorageKey : string;
    MimeType?  : string;
    SizeInKB?  : number;
    Files?     : express.FileArray;
}

export interface FileResourceSearchDownloadDomainModel {
    OwnerUserId?       : string,
    IsPublicResource?  : boolean;
    Version?           : string;
    ReferenceId?       : string;
    ReferenceType?     : string;
    Tag?               : string;
    DownloadOnlyLatest?: boolean;
}

export interface FileResourceMetadata {
    FileName    : string;
    FilePath    : string;
    MimeType    : string;
    OriginalName: string;
    Size        : number;
}

export interface FileResourceRenameDomainModel {
    id?        : string,
    NewFileName: string;
}
