import { FileResourceMetadata, ResourceReference } from "./file.resource.types";

export interface FileResourceDetailsDto {
    id?              : string;
    FileName?        : string;
    Url?             : string;
    OwnerUserId?     : string;
    UploadedByUserId?: string;
    IsPublicResource?: boolean;
    MimeType?        : string;
    DefaultVersion   : FileResourceMetadata;
    Versions?        : FileResourceMetadata[];
    References?      : ResourceReference[];
    Tags?            : string[];
}

export interface FileResourceDto {
    id?              : string;
    FileName?        : string;
    Url?             : string;
    OwnerUserId?     : string;
    IsPublicResource?: boolean;
    MimeType?        : string;
    DefaultVersion   : FileResourceMetadata;
}
