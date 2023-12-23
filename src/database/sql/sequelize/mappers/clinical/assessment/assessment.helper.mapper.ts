import {
    AssessmentBiometrics,
    AssessmentNodeType,
    BiometricQueryAnswer,
    ConditionCompositionType,
    ConditionOperandDataType,
    ConditionOperatorType,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    QueryResponseType,
    CAssessmentListNode,
    CAssessmentMessageNode,
    CAssessmentNode,
    CAssessmentNodePath,
    CAssessmentPathCondition,
    CAssessmentQueryOption,
    CAssessmentQueryResponse,
    CAssessmentQuestionNode,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
    DateQueryAnswer,
    FileQueryAnswer,
    BooleanQueryAnswer,
    ConditionOperand,
    CScoringCondition
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import AssessmentNode from '../../../models/clinical/assessment/assessment.node.model';
import AssessmentNodePath from '../../../models/clinical/assessment/assessment.node.path.model';
import AssessmentPathCondition from '../../../models/clinical/assessment/assessment.path.condition.model';
import AssessmentQueryOption from '../../../models/clinical/assessment/assessment.query.option.model';
import AssessmentQueryResponse from '../../../models/clinical/assessment/assessment.query.response.model';
import ScoringCondition from '../../../models/clinical/assessment/scoring.condition.model';

///////////////////////////////////////////////////////////////////////////////////

export class AssessmentHelperMapper {

    static toConditionDto(condition: AssessmentPathCondition): CAssessmentPathCondition {
        if (condition == null) {
            return null;
        }
        var conditionDto = new CAssessmentPathCondition();

        conditionDto.id = condition.id;
        conditionDto.NodeId = condition.NodeId;
        conditionDto.DisplayCode = condition.DisplayCode;
        conditionDto.ParentConditionId = condition.ParentConditionId;
        conditionDto.PathId = condition.PathId;

        conditionDto.OperatorType = condition.OperatorType as ConditionOperatorType;

        conditionDto.IsCompositeCondition = condition.IsCompositeCondition;
        conditionDto.CompositionType = condition.CompositionType as ConditionCompositionType;

        conditionDto.FirstOperand = new ConditionOperand(
            condition.FirstOperandDataType as ConditionOperandDataType,
            condition.FirstOperandName,
            condition.FirstOperandValue);

        conditionDto.SecondOperand = new ConditionOperand(
            condition.SecondOperandDataType as ConditionOperandDataType,
            condition.SecondOperandName,
            condition.SecondOperandValue);

        conditionDto.ThirdOperand = new ConditionOperand(
            condition.ThirdOperandDataType as ConditionOperandDataType,
            condition.ThirdOperandName,
            condition.ThirdOperandValue);

        return conditionDto;
    }

    static toOptionDto(option: AssessmentQueryOption): CAssessmentQueryOption {
        if (option == null) {
            return null;
        }
        var optionDto = new CAssessmentQueryOption();
        optionDto.id = option.id;
        optionDto.NodeId = option.NodeId;
        optionDto.DisplayCode = option.DisplayCode;
        optionDto.ProviderGivenCode = option.ProviderGivenCode;
        optionDto.Text = option.Text;
        optionDto.ImageUrl = option.ImageUrl;
        optionDto.Sequence = option.Sequence;
        return optionDto;
    }

    static toPathDto(path: AssessmentNodePath): CAssessmentNodePath {
        if (path == null) {
            return null;
        }
        var pathDto = new CAssessmentNodePath();
        pathDto.id = path.id;
        pathDto.ParentNodeId = path.ParentNodeId;
        pathDto.DisplayCode  = path.DisplayCode;
        pathDto.ConditionId  = path.ConditionId;
        pathDto.NextNodeId   = path.NextNodeId;
        pathDto.IsExitPath   = path.IsExitPath;
        pathDto.NextNodeDisplayCode = path.NextNodeDisplayCode;
        return pathDto;
    }

    static setCommonFields(dto, node) {
        dto.id = node.id;
        dto.DisplayCode = node.DisplayCode;
        dto.ProviderGivenCode = node.ProviderGivenCode;
        dto.ProviderGivenId = node.ProviderGivenId;
        dto.TemplateId = node.TemplateId;
        dto.NodeType = node.NodeType;
        dto.ParentNodeId = node.ParentNodeId;
        dto.Title = node.Title;
        dto.Description = node.Description;
        dto.Sequence = node.Sequence;
        dto.Score = node.Score;
        dto.ServeListNodeChildrenAtOnce = node.ServeListNodeChildrenAtOnce;
        dto.RawData = node.RawData;
    }

    static toNodeDto = (
        node: AssessmentNode,
        children?: CAssessmentNode[],
        paths?: CAssessmentNodePath[],
        options?: CAssessmentQueryOption[],
        scoringCondition?: CScoringCondition,
    ): CAssessmentMessageNode | CAssessmentQuestionNode | CAssessmentListNode => {

        if (node == null) {
            return null;
        }

        if (node.NodeType === AssessmentNodeType.Message) {
            var messageNodeDto = new CAssessmentMessageNode();
            AssessmentHelperMapper.setCommonFields(messageNodeDto, node);
            messageNodeDto.Message = node.Message;
            messageNodeDto.Acknowledged = node.Acknowledged;
            return messageNodeDto;
        }
        if (node.NodeType === AssessmentNodeType.Question) {
            var questionNodeDto = new CAssessmentQuestionNode();
            AssessmentHelperMapper.setCommonFields(questionNodeDto, node);
            questionNodeDto.QueryResponseType = node.QueryResponseType as QueryResponseType;
            questionNodeDto.Options = options;
            questionNodeDto.Paths = paths;
            questionNodeDto.CorrectAnswer = node.CorrectAnswer ? JSON.parse(node.CorrectAnswer) : null;
            questionNodeDto.ScoringCondition = scoringCondition ?? null;
            return questionNodeDto;
        }
        if (node.NodeType === AssessmentNodeType.NodeList) {
            var listNodeDto = new CAssessmentListNode();
            AssessmentHelperMapper.setCommonFields(listNodeDto, node);
            listNodeDto.ChildrenNodeIds = children?.map((x) => x.id);
            listNodeDto.ChildrenNodeDisplayCodes = children?.map((x) => x.DisplayCode);
            listNodeDto.Children = children;
            return listNodeDto;
        }
        return null;
    };

    static toQueryResponseDto(response: AssessmentQueryResponse): CAssessmentQueryResponse {

        if (response == null) {
            return null;
        }

        const responseType = response.Type as QueryResponseType;

        var responseDto = new CAssessmentQueryResponse();
        responseDto.id = response.id;
        responseDto.NodeId = response.NodeId;
        responseDto.AssessmentId = response.AssessmentId;
        responseDto.ResponseType = responseType;
        responseDto.Sequence = response.Sequence;
        responseDto.Additional = response.Additional;
        responseDto.CreatedAt = response.CreatedAt;

        if (response.Node) {
            responseDto.Node = this.toNodeDto(response.Node);
        }

        if (responseType === QueryResponseType.Text || responseType === QueryResponseType.Ok) {
            responseDto.TextValue = response.TextValue;
        } else if (responseType === QueryResponseType.Float) {
            responseDto.FloatValue = response.FloatValue;
        } else if (responseType === QueryResponseType.Integer) {
            responseDto.IntegerValue = response.IntegerValue;
        } else if (responseType === QueryResponseType.Boolean) {
            responseDto.BooleanValue = response.BooleanValue;
        } else if (responseType === QueryResponseType.SingleChoiceSelection) {
            responseDto.IntegerValue = response.IntegerValue;
        } else if (responseType === QueryResponseType.Date ||
            responseType === QueryResponseType.DateTime) {
            responseDto.DateValue = response.DateValue;
        } else if (
            responseType === QueryResponseType.MultiChoiceSelection ||
            responseType === QueryResponseType.FloatArray ||
            responseType === QueryResponseType.IntegerArray ||
            responseType === QueryResponseType.BooleanArray ||
            responseType === QueryResponseType.ObjectArray
        ) {
            responseDto.ArrayValue = JSON.parse(response.TextValue);
        } else if (responseType === QueryResponseType.File) {
            responseDto.TextValue = response.TextValue;
            responseDto.Url = response.Url;
            responseDto.ResourceId = response.ResourceId; //This is file resource uuid
        } else if (responseType === QueryResponseType.Object || responseType === QueryResponseType.Biometrics) {
            responseDto.ObjectValue = JSON.parse(response.TextValue);
        }

        return responseDto;
    }

    static toSingleChoiceAnswerDto(
        assessmentId: uuid,
        questionNode: CAssessmentQuestionNode,
        answer: number,
        option: CAssessmentQueryOption
    ): SingleChoiceQueryAnswer {
        var dto: SingleChoiceQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : questionNode.id,
            QuestionSequence : questionNode.Sequence,
            NodeDisplayCode  : questionNode.DisplayCode,
            Title            : questionNode.Title,
            ResponseType     : QueryResponseType.SingleChoiceSelection,
            ChosenSequence   : answer,
            ChosenOption     : option,
        };
        return dto;
    }

    static toMultiChoiceAnswerDto(
        assessmentId: uuid,
        questionNode: CAssessmentQuestionNode,
        answers: number[],
        options: CAssessmentQueryOption[]
    ): MultipleChoiceQueryAnswer {
        var dto: MultipleChoiceQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : questionNode.id,
            QuestionSequence : questionNode.Sequence,
            NodeDisplayCode  : questionNode.DisplayCode,
            Title            : questionNode.Title,
            ResponseType     : QueryResponseType.MultiChoiceSelection,
            ChosenSequences  : answers,
            ChosenOptions    : options,
        };
        return dto;
    }

    static toMessageAnswerDto(
        assessmentId: uuid,
        node: CAssessmentMessageNode,
    ): MessageAnswer {
        var dto: MessageAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Ok,
            Achnowledged     : true,
        };
        return dto;
    }

    static toBiometricsAnswerDto(
        assessmentId: uuid,
        node: CAssessmentQuestionNode,
        values: AssessmentBiometrics[]
    ): BiometricQueryAnswer {
        var dto: BiometricQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Biometrics,
            Values           : values,
        };
        return dto;
    }

    static toTextAnswerDto(
        assessmentId: uuid,
        node: CAssessmentQuestionNode,
        text: string,
    ): TextQueryAnswer {
        var dto: TextQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Text,
            Text             : text,
        };
        return dto;
    }

    static toDateAnswerDto(
        assessmentId: uuid,
        node: CAssessmentQuestionNode,
        date: Date,
    ): DateQueryAnswer {
        var dto: DateQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Date,
            Date             : date,
        };
        return dto;
    }

    static toIntegerAnswerDto(
        assessmentId: uuid,
        node: CAssessmentQuestionNode,
        field: string,
        value: number
    ): IntegerQueryAnswer {
        var dto: IntegerQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Integer,
            Field            : field,
            Value            : value
        };
        return dto;
    }

    static toBooleanAnswerDto(
        assessmentId: uuid,
        node: CAssessmentQuestionNode,
        field: string,
        value: boolean
    ): BooleanQueryAnswer {
        var dto: BooleanQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Boolean,
            Field            : field,
            Value            : value
        };
        return dto;
    }

    static toFloatAnswerDto(
        assessmentId: uuid,
        node: CAssessmentQuestionNode,
        field: string,
        value: number
    ): FloatQueryAnswer {
        var dto: FloatQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Float,
            Field            : field,
            Value            : value
        };
        return dto;
    }

    static toFileAnswerDto(
        assessmentId: uuid,
        node: CAssessmentQuestionNode,
        fileName: string,
        url: string,
        resourceId: uuid
    ): FileQueryAnswer {
        var dto: FileQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.File,
            Field            : fileName,
            Filepath         : url,
            Url              : url,
            ResourceId       : resourceId
        };
        return dto;
    }

    static toScoringConditionDto(condition: ScoringCondition): CScoringCondition {
        if (condition == null) {
            return null;
        }
        var conditionDto = new CScoringCondition();

        conditionDto.id                = condition.id;
        conditionDto.TemplateId        = condition.TemplateId;
        conditionDto.NodeId            = condition.NodeId;
        conditionDto.DisplayCode       = condition.DisplayCode;
        conditionDto.ParentConditionId = condition.ParentConditionId;
        conditionDto.ResolutionScore   = condition.ResolutionScore;

        conditionDto.OperatorType = condition.OperatorType as ConditionOperatorType;

        conditionDto.IsCompositeCondition = condition.IsCompositeCondition;
        conditionDto.CompositionType = condition.CompositionType as ConditionCompositionType;

        conditionDto.FirstOperand = new ConditionOperand(
            condition.FirstOperandDataType as ConditionOperandDataType,
            condition.FirstOperandName,
            condition.FirstOperandValue);

        conditionDto.SecondOperand = new ConditionOperand(
            condition.SecondOperandDataType as ConditionOperandDataType,
            condition.SecondOperandName,
            condition.SecondOperandValue);

        conditionDto.ThirdOperand = new ConditionOperand(
            condition.ThirdOperandDataType as ConditionOperandDataType,
            condition.ThirdOperandName,
            condition.ThirdOperandValue);

        return conditionDto;
    }

}
