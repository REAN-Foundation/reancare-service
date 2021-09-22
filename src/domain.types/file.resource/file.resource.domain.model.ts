import * as express from 'express-fileupload';
import { FileResourceMetadata, ResourceReference } from "./file.resource.types";

export interface FileResourceUploadDomainModel {
    id?                    : string,
    FileMetadata           : FileResourceMetadata;
    OwnerUserId?           : string;
    UploadedByUserId?      : string;
    IsPublicResource?      : boolean;
    IsMultiResolutionImage?: boolean;
    References?            : ResourceReference[];
    Tags?                  : string[];
    MimeType?              : string;
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

export interface FileResourceRenameDomainModel {
    id?        : string,
    NewFileName: string;
}
