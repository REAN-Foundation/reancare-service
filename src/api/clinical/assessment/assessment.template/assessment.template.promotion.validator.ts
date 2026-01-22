import express from 'express';
import { BaseValidator, Where } from '../../../base.validator';
import {
    AssessmentPromotionFromRequest,
    AssessmentPromotionPayload
} from '../../../../domain.types/clinical/assessment/assessment.promotion.types';
import { TargetEnvironment } from '../../../../domain.types/tenant/tenant.promotion.types';

///////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplatePromotionValidator extends BaseValidator {

    constructor() {
        super();
    }

    validatePromotionFrom = async (request: express.Request): Promise<AssessmentPromotionFromRequest> => {
        await this.validateEnum(request, 'TargetEnvironment', Where.Body, true, false, TargetEnvironment);

        this.validateRequest(request);

        const body = request.body;

        const currentEnv = process.env.NODE_ENV;
        if (body.TargetEnvironment === currentEnv) {
            throw new Error('Target environment cannot be the same as current environment');
        }

        return {
            TargetEnvironment : body.TargetEnvironment as TargetEnvironment
        };
    };

    validatePromotionTo = async (request: express.Request): Promise<AssessmentPromotionPayload> => {
        await this.validateString(request, 'SourceEnvironment', Where.Body, true, false);
        await this.validateEnum(request, 'TargetEnvironment', Where.Body, true, false, TargetEnvironment);
        await this.validateString(request, 'TenantCode', Where.Body, true, false);
        await this.validateObject(request, 'Assessment', Where.Body, true, false);
        await this.validateString(request, 'Assessment.DisplayCode', Where.Body, true, false);
        await this.validateString(request, 'Assessment.Title', Where.Body, true, false);
        await this.validateString(request, 'Assessment.RootNodeDisplayCode', Where.Body, true, false);
        await this.validateArray(request, 'Assessment.Nodes', Where.Body, true, false);

        this.validateRequest(request);

        const body = request.body;
        return body as AssessmentPromotionPayload;
    };

    validateLambdaAuthHeader = (request: express.Request): boolean => {
        const lambdaAuthToken = request.headers['x-lambda-auth'] as string;
        const expectedToken = process.env.LAMBDA_ASSESSMENT_PROMOTION_AUTH_TOKEN
            ?? process.env.LAMBDA_PROMOTION_AUTH_TOKEN;

        if (!expectedToken) {
            throw new Error('Lambda assessment promotion auth token is not configured');
        }

        if (!lambdaAuthToken || lambdaAuthToken !== expectedToken) {
            return false;
        }

        return true;
    };

}
