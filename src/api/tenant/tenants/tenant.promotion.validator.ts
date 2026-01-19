import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import {
    PromotionFromRequestBody,
    TargetEnvironment,
    TenantPromotionPayload
} from '../../../domain.types/tenant/tenant.promotion.types';

///////////////////////////////////////////////////////////////////////////////

export class TenantPromotionValidator extends BaseValidator {

    constructor() {
        super();
    }

    validatePromotionFrom = async (request: express.Request): Promise<PromotionFromRequestBody> => {
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

    validatePromotionTo = async (request: express.Request): Promise<TenantPromotionPayload> => {
        await this.validateString(request, 'SourceEnvironment', Where.Body, true, false);
        await this.validateEnum(request, 'TargetEnvironment', Where.Body, true, false, TargetEnvironment);
        await this.validateObject(request, 'Tenant', Where.Body, true, false);
        await this.validateString(request, 'Tenant.Name', Where.Body, true, false);
        await this.validateString(request, 'Tenant.Code', Where.Body, true, false);
        await this.validateString(request, 'Tenant.Description', Where.Body, false, true);
        await this.validateString(request, 'Tenant.Phone', Where.Body, false, true);
        await this.validateString(request, 'Tenant.Email', Where.Body, false, true);
        await this.validateObject(request, 'Settings', Where.Body, false, true);
        await this.validateObject(request, 'MarketingSettings', Where.Body, false, true);

        this.validateRequest(request);

        const body = request.body;
        return body as TenantPromotionPayload;
    };

    validateLambdaAuthHeader = (request: express.Request): boolean => {
        const lambdaAuthToken = request.headers['x-lambda-auth'] as string;
        const expectedToken = process.env.LAMBDA_PROMOTION_AUTH_TOKEN;

        if (!expectedToken) {
            throw new Error('Lambda promotion auth token is not configured');
        }

        if (!lambdaAuthToken || lambdaAuthToken !== expectedToken) {
            return false;
        }

        return true;
    };

}
