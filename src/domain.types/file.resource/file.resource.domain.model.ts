import * as express from 'express-fileupload';
import { ResourceReferenceItem } from "./file.resource.types";

export interface FileResourceUploadDomainModel {
    id?                    : string,
    Files?                 : express.FileArray;
    OwnerUserId?           : string;
    UploadedByUserId?      : string;
    IsPublicResource?      : boolean;
    IsMultiResolutionImage?: boolean;
    References?            : ResourceReferenceItem[];
    Tags?                  : string[];
    MimeType?              : string;
    MetaInformation?       : string;
    SizeInKB?              : number;
    UploadedDate?          : Date;
}

export interface FileResourceVersionDomainModel {
    ResourceId?: string;
    Version?   : string;
    Files?     : express.FileArray;
}

export interface FileResourceSearchDownloadDomainModel {
    OwnerUserId?     : string,
    IsPublicResource?: boolean;
    Version?         : string;
    ReferenceId?     : string;
    ReferenceType?   : string;
    Tag              : string;
}
