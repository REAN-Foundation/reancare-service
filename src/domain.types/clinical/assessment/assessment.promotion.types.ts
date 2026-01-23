import { CAssessmentTemplate } from './assessment.types';
import { TargetEnvironment } from '../../tenant/tenant.promotion.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface AssessmentPromotionPayload {
    SourceEnvironment  : string;
    TargetEnvironment  : TargetEnvironment;
    TenantCode         : string;
    Assessment         : CAssessmentTemplate;
}

export interface AssessmentPromotionFromRequest {
    TargetEnvironment: TargetEnvironment;
}

export interface AssessmentPromotionFromResponse {
    AssessmentCode    : string;
    AssessmentTitle   : string;
    TenantCode        : string;
    TargetEnvironment : TargetEnvironment;
    InitiatedAt       : Date;
    NodeCount         : number;
    Message           : string;
}

export enum AssessmentPromotionAction {
    Created = 'CREATED',
    Updated = 'UPDATED'
}

export interface AssessmentPromotionToResponse {
    AssessmentId   : string;
    AssessmentCode : string;
    Action         : AssessmentPromotionAction;
    NodesCreated   : number;
    NodesUpdated   : number;
    NodesDeleted   : number;
}

export interface NodeSyncResult {
    Created : string[];
    Updated : string[];
    Deleted : string[];
}

export interface AssessmentPromotionLambdaPayload {
    TargetEnvironment : TargetEnvironment;
    Payload           : AssessmentPromotionPayload;
}

export interface AssessmentPromotionLambdaResponse {
    StatusCode : number;
    Body       : AssessmentPromotionToResponse | { Error: string };
}
