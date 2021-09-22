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
    DefaultVersionId?      : string;
}

export interface FileResourceRenameDomainModel {
    id?        : string,
    NewFileName: string;
}
