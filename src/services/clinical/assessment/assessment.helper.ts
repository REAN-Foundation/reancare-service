import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentQueryDto } from '../../../domain.types/clinical/assessment/assessment.query.dto';
import {
    AssessmentNodeType, QueryResponseType,
    CAssessmentMessageNode,
    CAssessmentNode,
    CAssessmentQuestionNode } from '../../../domain.types/clinical/assessment/assessment.types';

//////////////////////////////////////////////////////////////////////////////////////////////

export class AssessmentHelperService {

    public static questionNodeAsQueryDto(node: CAssessmentNode, assessment: AssessmentDto) {
        const questionNode = node as CAssessmentQuestionNode;
        const query: AssessmentQueryDto = {
            id                   : questionNode.id,
            DisplayCode          : questionNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            ParentNodeId         : questionNode.ParentNodeId,
            AssessmentId         : assessment.id,
            Sequence             : questionNode.Sequence,
            NodeType             : questionNode.NodeType as AssessmentNodeType,
            Title                : questionNode.Title,
            Description          : questionNode.Description,
            ExpectedResponseType : questionNode.QueryResponseType as QueryResponseType,
            Options              : questionNode.Options,
            ProviderGivenCode    : questionNode.ProviderGivenCode,
            CorrectAnswer        : questionNode.CorrectAnswer,
        };
        return query;
    }

    public static messageNodeAsQueryDto(node: CAssessmentNode, assessment: AssessmentDto) {
        const messageNode = node as CAssessmentMessageNode;
        const query: AssessmentQueryDto = {
            id                   : messageNode.id,
            DisplayCode          : messageNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            ParentNodeId         : messageNode.ParentNodeId,
            AssessmentId         : assessment.id,
            Sequence             : messageNode.Sequence,
            NodeType             : messageNode.NodeType as AssessmentNodeType,
            Title                : messageNode.Title,
            Description          : messageNode.Description,
            ExpectedResponseType : QueryResponseType.Ok,
            Options              : [],
            ProviderGivenCode    : messageNode.ProviderGivenCode,
        };
        return query;
    }

}
