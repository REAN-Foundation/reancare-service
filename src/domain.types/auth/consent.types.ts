import { BaseSearchFilters, BaseSearchResults } from '../miscellaneous/base.search.types';
import { uuid } from '../miscellaneous/system.types';

export interface ConsentCreateModel {
    ResourceId            ?: uuid;
    ResourceCategory       : string;
    ResourceName          ?: string;
    TenantId               : uuid;
    OwnerUserId           ?: uuid;
    ConsentHolderUserId    : uuid;
    AllResourcesInCategory?: boolean;
    TenantOwnedResource   ?: boolean;
    Perpetual              : boolean;
    Revoked?               : boolean;
    RevokedTimestamp       : Date;
    ConsentGivenOn         : Date;
    ConsentValidFrom       : Date;
    ConsentValidTill      ?: Date;
}

export interface ConsentUpdateModel {
    AllResourcesInCategory?: boolean;
    TenantOwnedResource   ?: boolean;
    Perpetual             ?: boolean;
}

export interface ConsentDto {
    id                     : uuid;
    ResourceId            ?: uuid;
    ResourceCategory       : string;
    ResourceName          ?: string;
    TenantId               : uuid;
    OwnerUserId           ?: uuid;
    ConsentHolderUserId    : uuid;
    AllResourcesInCategory : boolean;
    TenantOwnedResource    : boolean;
    Perpetual              : boolean;
    Revoked                : boolean;
    RevokedTimestamp       : Date;
    ConsentGivenOn         : Date;
    ConsentValidFrom       : Date;
    ConsentValidTill      ?: Date;
}

export interface ConsentSearchFilters extends BaseSearchFilters {
    ResourceCategory      ?: string;
    ResourceName          ?: string;
    TenantId              ?: uuid;
    OwnerUserId           ?: uuid;
    ConsentHolderUserId   ?: uuid;
    AllResourcesInCategory?: boolean;
    TenantOwnedResource   ?: boolean;
    Perpetual             ?: boolean;
    Revoked               ?: boolean;
}

export interface ConsentSearchResults extends BaseSearchResults {
    Items: ConsentDto[];
}
