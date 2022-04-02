import express from 'express';
import { AssessmentNodeType, CAssessmentListNode, CAssessmentMessageNode, CAssessmentNode, CAssessmentQueryOption, CAssessmentQuestionNode } from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentTemplateDomainModel } from '../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.template.search.types';
import { BaseValidator, Where } from '../../base.validator';
import { Helper } from '../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): AssessmentTemplateDomainModel => {

        const patientAssessmentTemplateModel: AssessmentTemplateDomainModel = {
            Type                   : request.body.Type ?? null,
            Title                  : request.body.Title ?? null,
            Description            : request.body.Description,
            ProviderAssessmentCode : request.body.ProviderAssessmentCode ?? null,
            Provider               : request.body.Provider ?? null,
        };

        return patientAssessmentTemplateModel;
    };

    create = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (
        request: express.Request
    ): Promise<AssessmentTemplateSearchFilters> => {

        await this.validateUuid(request, 'title', Where.Query, false, false);
        await this.validateString(request, 'type', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);

    };

    private getFilter(request): AssessmentTemplateSearchFilters {

        var filters: AssessmentTemplateSearchFilters = {
            Title : request.query.title ?? null,
            Type  : request.query.type ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    update = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateString(request, 'Type', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);

        this.validateRequest(request);

    }

    private async validateUpdateBody(request) {

        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);

        this.validateRequest(request);
        
    }

    importFromJson = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    addNode = async (request: express.Request):
        Promise<CAssessmentNode | CAssessmentListNode | CAssessmentQuestionNode | CAssessmentMessageNode> => {
        
        var templateId = await this.getParamUuid(request, 'id');
        await this.validateUuid(request, 'ParentNodeId', Where.Body, false, true);
        await this.validateString(request, 'NodeType', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'QueryResponseType', Where.Body, false, false);
        await this.validateArray(request, 'Options', Where.Body, false, false);
        await this.validateDecimal(request, 'Score', Where.Body, false, false);
    
        this.validateRequest(request);
        
        if (request.body.NodeType === AssessmentNodeType.Question) {
            var questionNode : CAssessmentQuestionNode = {
                ParentNodeId      : request.body.ParentNodeId,
                NodeType          : AssessmentNodeType.Question,
                QueryResponseType : request.body.QueryResponseType,
                Required          : true,
                ProviderGivenId   : request.body.ProviderGivenId ?? null,
                ProviderGivenCode : request.body.ProviderGivenCode ?? null,
                Title             : request.body.Title,
                TemplateId        : templateId,
                Score             : request.body.Score ?? 0,
                Options           : []
            };
            if (request.body.Options && request.body.Options.length > 0) {
                var options: CAssessmentQueryOption[] = [];
                for (var o of request.body.Options) {
                    var option: CAssessmentQueryOption = {
                        DisplayCode       : Helper.generateDisplayCode('QNode'),
                        Text              : o.Text,
                        ProviderGivenCode : o.ProviderGivenCode ?? null,
                        Sequence          : o.Sequence
                    };
                    options.push(option);
                }
                questionNode.Options = options;
            }
            return questionNode;
        }
        else if (request.body.NodeType === AssessmentNodeType.NodeList) {
            var listNode : CAssessmentListNode = {
                ParentNodeId             : request.body.ParentNodeId,
                NodeType                 : AssessmentNodeType.NodeList,
                Required                 : true,
                ProviderGivenId          : request.body.ProviderGivenId ?? null,
                ProviderGivenCode        : request.body.ProviderGivenCode ?? null,
                Title                    : request.body.Title,
                TemplateId               : templateId,
                Score                    : request.body.Score ?? 0,
                ChildrenNodeDisplayCodes : [],
                ChildrenNodeIds          : []
            };
            return listNode;
        }
        else {
            var messageNode : CAssessmentMessageNode = {
                ParentNodeId      : request.body.ParentNodeId,
                NodeType          : AssessmentNodeType.Message,
                Required          : true,
                ProviderGivenId   : request.body.ProviderGivenId ?? null,
                ProviderGivenCode : request.body.ProviderGivenCode ?? null,
                Title             : request.body.Title,
                TemplateId        : templateId,
                Score             : request.body.Score ?? 0,
                Message           : request.body.Message,
                Acknowledged      : false
            };
            return messageNode;
        }
    };

}
