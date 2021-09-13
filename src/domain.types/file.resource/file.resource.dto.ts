import { ResourceReferenceItem, SiblingResource } from "./file.resource.types";

export interface FileResourceDto {
    id?: string;
    EhrId?: string;
    FileName?: string;
    OwnerUserId?: string;
    UploadedByUserId?: string;
    CloudStorageKey?: string;
    IsPublic?: boolean;
    SiblingResources?: SiblingResource[];
    ReferenceItems?: ResourceReferenceItem[];
    MimeType?: string;
    MetaInformation?: string;
    SizeInKB?: number;
    UploadedDate?: Date;
    PublicUrl?: string;
    AuthUrl?: string;
}
