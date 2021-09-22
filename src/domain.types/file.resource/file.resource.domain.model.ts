import { ResourceReferenceItem, SiblingResource } from "./file.resource.types";

export interface FileResourceDomainModel {
    id?: string,
    EhrId?: string;
    FileName?: string;
    OwnerUserId?: string;
    UploadedByUserId?: string;
    IsPublic?: boolean;
    SiblingResources?: SiblingResource[];
    ReferenceItems?: ResourceReferenceItem[];
    MimeType?: string;
    MetaInformation?: string;
    SizeInKB?: number;
    UploadedDate?: Date;
}
