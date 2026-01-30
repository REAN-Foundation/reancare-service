import { TenantSettingsDomainModel, TenantSettingsTypes } from './tenant.settings.types';
import { TenantMarketingStyling, TenantMarketingContent } from './marketing/tenant.settings.marketing.types';

///////////////////////////////////////////////////////////////////////////////////////

export enum TargetEnvironment {
    Development = 'development',
    UAT         = 'uat',
    Production  = 'production'
}

export const TargetEnvironmentList = [
    TargetEnvironment.Development,
    TargetEnvironment.UAT,
    TargetEnvironment.Production,
];

///////////////////////////////////////////////////////////////////////////////////////

export interface TenantPromotionData {
    Name        : string;
    Code        : string;
    Description?: string;
    Phone?      : string;
    Email?      : string;
}

export interface TenantPromotionSettings {
    Common?          : TenantSettingsDomainModel[TenantSettingsTypes.Common];
    Followup?        : TenantSettingsDomainModel[TenantSettingsTypes.Followup];
    ChatBot?         : TenantSettingsDomainModel[TenantSettingsTypes.ChatBot];
    Forms?           : TenantSettingsDomainModel[TenantSettingsTypes.Forms];
    Consent?         : TenantSettingsDomainModel[TenantSettingsTypes.Consent];
    CustomSettings?  : TenantSettingsDomainModel[TenantSettingsTypes.CustomSettings];
    VitalsThresholds?: TenantSettingsDomainModel[TenantSettingsTypes.VitalsThresholds];
}

export interface TenantPromotionMarketingSettings {
    Styling?: TenantMarketingStyling;
    Content?: TenantMarketingContent;
}

///////////////////////////////////////////////////////////////////////////////////////

export interface TenantPromotionPayload {
    SourceEnvironment   : string;
    TargetEnvironment   : TargetEnvironment;
    Tenant              : TenantPromotionData;
    Settings            : TenantPromotionSettings;
    MarketingSettings   : TenantPromotionMarketingSettings;
}

///////////////////////////////////////////////////////////////////////////////////////

export interface PromotionFromRequestBody {
    TargetEnvironment: TargetEnvironment;
}

export interface PromotionFromResponse {
    TenantCode        : string;
    TenantName        : string;
    TargetEnvironment : TargetEnvironment;
    InitiatedAt       : Date;
    Message           : string;
}

///////////////////////////////////////////////////////////////////////////////////////

export interface PromotionToRequestBody {
    Payload: TenantPromotionPayload;
}

export enum PromotionAction {
    Created = 'CREATED',
    Updated = 'UPDATED'
}

export interface PromotionToResponse {
    TenantId   : string;
    TenantCode : string;
    TenantName : string;
    Action     : PromotionAction;
    AdminCredentials?: {
        UserName          : string;
        TemporaryPassword : string;
    };
}

///////////////////////////////////////////////////////////////////////////////////////

export interface TenantPromotionLambdaPayload {
    TargetEnvironment : TargetEnvironment;
    Payload           : TenantPromotionPayload;
}

export interface TenantPromotionLambdaResponse {
    StatusCode : number;
    Body       : PromotionToResponse | { Error: string };
}
