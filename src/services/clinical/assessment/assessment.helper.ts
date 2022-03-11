import { ApiError } from '../../../common/api.error';
import { IAssessmentHelperRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface';
import { IAssessmentRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface';
import { IAssessmentTemplateRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface';
import { AssessmentHelperMapper } from '../../../database/sql/sequelize/mappers/clinical/assessment/assessment.helper.mapper';
import { AssessmentAnswerDomainModel } from '../../../domain.types/clinical/assessment/assessment.answer.domain.model';
import { AssessmentDomainModel } from '../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentQueryDto } from '../../../domain.types/clinical/assessment/assessment.query.dto';
import { AssessmentQuestionResponseDto } from '../../../domain.types/clinical/assessment/assessment.question.response.dto';
import {
    AssessmentNodeType, BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer, QueryResponseType,
    CAssessmentMessageNode,
    CAssessmentNode,
    CAssessmentNodePath,
    CAssessmentQueryOption,
    CAssessmentQuestionNode, SingleChoiceQueryAnswer, TextQueryAnswer
} from '../../../domain.types/clinical/assessment/assessment.types';


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
