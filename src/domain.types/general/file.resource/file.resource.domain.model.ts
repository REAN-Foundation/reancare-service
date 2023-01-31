import { FileResourceMetadata, ResourceReference } from "./file.resource.types";

export interface FileResourceUploadDomainModel {
    id?                    : string,
    FileMetadata           : FileResourceMetadata;
    OwnerUserId?           : string;
    UploadedByUserId?      : string;
    IsPublicResource?      : boolean;
    IsMultiResolutionImage?: boolean;
    MimeType?              : string;
    DefaultVersionId?      : string;
}

export interface FileResourceRenameDomainModel {
    id?        : string,
    NewFileName: string;
}

export interface FileResourceUpdateModel {
    FileMetadata?          : FileResourceMetadata;
    ResourceId             : string;
    References?            : ResourceReference[];
    Tags?                  : string[];
    IsMultiResolutionImage?: boolean;
}
