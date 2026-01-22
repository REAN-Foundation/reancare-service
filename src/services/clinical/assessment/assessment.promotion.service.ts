import { inject, injectable } from 'tsyringe';
import { IAssessmentTemplateRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface';
import { IAssessmentHelperRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface';
import { ITenantRepo } from '../../../database/repository.interfaces/tenant/tenant.repo.interface';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { TargetEnvironment } from '../../../domain.types/tenant/tenant.promotion.types';
import {
    AssessmentPromotionPayload,
    AssessmentPromotionToResponse,
    AssessmentPromotionAction,
    AssessmentPromotionLambdaPayload,
    AssessmentPromotionLambdaResponse,
    NodeSyncResult
} from '../../../domain.types/clinical/assessment/assessment.promotion.types';
import { CAssessmentTemplate } from '../../../domain.types/clinical/assessment/assessment.types';
import { ApiError } from '../../../common/api.error';
import { Logger } from '../../../common/logger';
import { AwsLambdaService } from '../../../modules/cloud.services/aws.service';
import { Injector } from '../../../startup/injector';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentPromotionService {

    _lambdaService: AwsLambdaService = Injector.Container.resolve(AwsLambdaService);

    constructor(
        @inject('IAssessmentTemplateRepo') private _templateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentHelperRepo') private _helperRepo: IAssessmentHelperRepo,
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
    ) {}

    //#region Public Methods

    public preparePromotionPayload = async (
        templateId: uuid,
        tenantCode: string,
        targetEnvironment: TargetEnvironment
    ): Promise<AssessmentPromotionPayload> => {

        const template = await this._templateRepo.getById(templateId);
        if (!template) {
            throw new ApiError(404, 'Assessment template not found');
        }

        const templateObj = await this._helperRepo.readTemplateAsObj(templateId);

        const payload: AssessmentPromotionPayload = {
            SourceEnvironment : process.env.NODE_ENV,
            TargetEnvironment : targetEnvironment,
            TenantCode        : tenantCode,
            Assessment        : templateObj,
        };

        return payload;
    };

    public triggerPromotion = async (
        payload: AssessmentPromotionPayload
    ): Promise<AssessmentPromotionLambdaResponse> => {

        const lambdaFunctionName = process.env.ASSESSMENT_PROMOTION_LAMBDA_FUNCTION;

        if (!lambdaFunctionName) {
            throw new ApiError(500, 'Assessment promotion Lambda function is not configured');
        }

        const lambdaPayload: AssessmentPromotionLambdaPayload = {
            TargetEnvironment : payload.TargetEnvironment,
            Payload           : payload,
        };

        Logger.instance().log(`Triggering assessment promotion to ${payload.TargetEnvironment}`);

        const response = await this._lambdaService.invokeLambdaFunction<AssessmentPromotionLambdaResponse>(
            lambdaFunctionName,
            lambdaPayload
        );

        Logger.instance().log(`Assessment promotion Lambda function invoked successfully with response: ${JSON.stringify(response)}`);
        return response;
    };

    public processIncomingPromotion = async (
        payload: AssessmentPromotionPayload
    ): Promise<AssessmentPromotionToResponse> => {

        Logger.instance().log(`Processing incoming assessment promotion for: ${payload.Assessment.DisplayCode}`);

        const tenant = await this._tenantRepo.getTenantWithCode(payload.TenantCode);
        if (!tenant) {
            throw new ApiError(404, `Tenant with code '${payload.TenantCode}' not found in target environment`);
        }

        const existingTemplate = await this._templateRepo.getByDisplayCodeAndTenant(
            payload.Assessment.DisplayCode,
            tenant.id
        );

        if (existingTemplate) {
            Logger.instance().log(`Updating existing assessment: ${existingTemplate.id}`);
            return await this.updateExistingAssessment(existingTemplate.id, payload);
        }
        Logger.instance().log(`Creating new assessment from promotion`);
        return await this.createNewAssessment(payload, tenant.id);
    };

    //#endregion

    //#region Private Methods

    private updateExistingAssessment = async (
        templateId: uuid,
        payload: AssessmentPromotionPayload
    ): Promise<AssessmentPromotionToResponse> => {

        await this._templateRepo.update(templateId, {
            Title                       : payload.Assessment.Title,
            Description                 : payload.Assessment.Description,
            Type                        : payload.Assessment.Type,
            ScoringApplicable           : payload.Assessment.ScoringApplicable,
            ServeListNodeChildrenAtOnce : payload.Assessment.ServeListNodeChildrenAtOnce,
            Provider                    : payload.Assessment.Provider,
            ProviderAssessmentCode      : payload.Assessment.ProviderAssessmentCode,
        });

        const syncResult: NodeSyncResult = await this._helperRepo.syncNodesForPromotion(
            templateId,
            payload.Assessment.Nodes,
            payload.Assessment.RootNodeDisplayCode
        );

        Logger.instance().log(`Node sync complete - Created: ${syncResult.Created.length}, Updated: ${syncResult.Updated.length}, Deleted: ${syncResult.Deleted.length}`);

        return {
            AssessmentId   : templateId,
            AssessmentCode : payload.Assessment.DisplayCode,
            Action         : AssessmentPromotionAction.Updated,
            NodesCreated   : syncResult.Created.length,
            NodesUpdated   : syncResult.Updated.length,
            NodesDeleted   : syncResult.Deleted.length,
        };
    };

    private createNewAssessment = async (
        payload: AssessmentPromotionPayload,
        tenantId: uuid
    ): Promise<AssessmentPromotionToResponse> => {

        const templateObj: CAssessmentTemplate = {
            ...payload.Assessment,
            TenantId : tenantId,
        };

        const template = await this._helperRepo.addTemplateForPromotion(templateObj);

        Logger.instance().log(`Created assessment template: ${template.id} with ${payload.Assessment.Nodes.length} nodes`);

        return {
            AssessmentId   : template.id,
            AssessmentCode : payload.Assessment.DisplayCode,
            Action         : AssessmentPromotionAction.Created,
            NodesCreated   : payload.Assessment.Nodes.length,
            NodesUpdated   : 0,
            NodesDeleted   : 0,
        };
    };

    //#endregion

}
