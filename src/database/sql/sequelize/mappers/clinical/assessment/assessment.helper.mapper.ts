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
    SAssessmentListNode,
    SAssessmentMessageNode,
    SAssessmentNode,
    SAssessmentNodePath,
    SAssessmentPathCondition,
    SAssessmentQueryOption,
    SAssessmentQueryResponse,
    SAssessmentQuestionNode, SingleChoiceQueryAnswer, TextQueryAnswer
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import AssessmentNode from '../../../models/clinical/assessment/assessment.node.model';
import AssessmentNodePath from '../../../models/clinical/assessment/assessment.node.path.model';
import AssessmentPathCondition from '../../../models/clinical/assessment/assessment.path.condition.model';
import AssessmentQueryOption from '../../../models/clinical/assessment/assessment.query.option.model';
import AssessmentQueryResponse from '../../../models/clinical/assessment/assessment.query.response.model';

///////////////////////////////////////////////////////////////////////////////////

export class AssessmentHelperMapper {

    static toConditionDto(condition: AssessmentPathCondition): SAssessmentPathCondition {
        if (condition == null) {
            return null;
        }
        var conditionDto = new SAssessmentPathCondition();
        conditionDto.id = condition.id;
        conditionDto.NodeId = condition.NodeId;
        conditionDto.DisplayCode = condition.DisplayCode;
        conditionDto.ParentConditionId = condition.ParentConditionId;
        conditionDto.PathId = condition.PathId;

        conditionDto.OperatorType = condition.OperatorType as ConditionOperatorType;

        conditionDto.IsCompositeCondition = condition.IsCompositeCondition;
        conditionDto.CompositionType = condition.CompositionType as ConditionCompositionType;
        conditionDto.FirstOperand.DataType = condition.FirstOperandDataType as ConditionOperandDataType;
        conditionDto.FirstOperand.Name = condition.FirstOperandName;
        conditionDto.FirstOperand.Value = condition.FirstOperandValue;

        conditionDto.SecondOperand.DataType = condition.SecondOperandDataType as ConditionOperandDataType;
        conditionDto.SecondOperand.Name = condition.SecondOperandName;
        conditionDto.SecondOperand.Value = condition.SecondOperandValue;

        conditionDto.ThirdOperand.DataType = condition.ThirdOperandDataType as ConditionOperandDataType;
        conditionDto.ThirdOperand.Name = condition.ThirdOperandName;
        conditionDto.ThirdOperand.Value = condition.ThirdOperandValue;

        return conditionDto;
    }

    static toOptionDto(option: AssessmentQueryOption): SAssessmentQueryOption {
        if (option == null) {
            return null;
        }
        var optionDto = new SAssessmentQueryOption();
        optionDto.id = option.id;
        optionDto.NodeId = option.NodeId;
        (optionDto.DisplayCode = option.DisplayCode),
        (optionDto.ProviderGivenCode = option.ProviderGivenCode),
        (optionDto.Text = option.Text);
        optionDto.ImageUrl = option.ImageUrl;
        optionDto.Sequence = option.Sequence;
        return optionDto;
    }

    static toPathDto(path: AssessmentNodePath): SAssessmentNodePath {
        if (path == null) {
            return null;
        }
        var pathDto = new SAssessmentNodePath();
        pathDto.id = path.id;
        pathDto.ParentNodeId = path.ParentNodeId;
        pathDto.DisplayCode = path.DisplayCode;
        pathDto.ConditionId = path.ConditionId;
        pathDto.NextNodeId = path.NextNodeId;
        pathDto.NextNodeDisplayCode = path.NextNodeDisplayCode;
        return pathDto;
    }

    static toNodeDto = (
        node: AssessmentNode,
        children?: SAssessmentNode[],
        paths?: SAssessmentNodePath[],
        options?: SAssessmentQueryOption[]
    ): SAssessmentMessageNode | SAssessmentQuestionNode | SAssessmentListNode => {
        if (node == null) {
            return null;
        }

        function setCommonFields(dto, node) {
            dto.id = node.id;
            dto.DisplayCode = node.DisplayCode;
            dto.ProviderGivenCode = node.ProviderGivenCode;
            dto.ProviderGivenId = node.ProviderGivenId,
            dto.TemplateId = node.TemplateId;
            dto.NodeType = node.NodeType;
            dto.ParentNodeId = node.ParentNodeId;
            dto.Title = node.Title;
            dto.Description = node.Description;
            dto.Sequence = node.Sequence;
            dto.Score = node.Score;
        }

        if (node.NodeType === AssessmentNodeType.Message) {
            var messageNodeDto = new SAssessmentMessageNode();
            setCommonFields(messageNodeDto, node);
            messageNodeDto.Message = node.Message;
            messageNodeDto.Acknowledged = node.Acknowledged;
            return messageNodeDto;
        }
        if (node.NodeType === AssessmentNodeType.Question) {
            var questionNodeDto = new SAssessmentQuestionNode();
            setCommonFields(questionNodeDto, node);
            questionNodeDto.QueryResponseType = node.QueryResponseType as QueryResponseType;
            questionNodeDto.Options = options;
            questionNodeDto.Paths = paths;
            return questionNodeDto;
        }
        if (node.NodeType === AssessmentNodeType.NodeList) {
            var listNodeDto = new SAssessmentListNode();
            setCommonFields(listNodeDto, node);
            listNodeDto.ChildrenNodeIds = children?.map((x) => x.id);
            listNodeDto.ChildrenNodeDisplayCodes = children?.map((x) => x.DisplayCode);
            listNodeDto.Children = children;
            return listNodeDto;
        }
        return null;
    };

    static toQueryResponseDto(response: AssessmentQueryResponse): SAssessmentQueryResponse {

        if (response == null) {
            return null;
        }

        const responseType = response.Type as QueryResponseType;

        var responseDto = new SAssessmentQueryResponse();
        responseDto.id = response.id;
        responseDto.NodeId = response.NodeId;
        responseDto.AssessmentId = response.AssessmentId;
        responseDto.ResponseType = responseType;
        responseDto.Sequence = response.Sequence;
        responseDto.Additional = response.Additional;

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
        } else if (
            responseType === QueryResponseType.MultiChoiceSelection ||
            responseType === QueryResponseType.FloatArray ||
            responseType === QueryResponseType.IntegerArray ||
            responseType === QueryResponseType.BooleanArray ||
            responseType === QueryResponseType.ObjectArray
        ) {
            responseDto.ArrayValue = JSON.parse(response.TextValue);
        } else if (responseType === QueryResponseType.File) {
            responseDto.TextValue = response.TextValue; //This is file resource uuid
        } else if (responseType === QueryResponseType.Object || responseType === QueryResponseType.Biometrics) {
            responseDto.ObjectValue = JSON.parse(response.TextValue);
        }

        return responseDto;
    }

    static toSingleChoiceAnswerDto(
        assessmentId: uuid,
        questionNode: SAssessmentQuestionNode,
        answer: number,
        option: SAssessmentQueryOption
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
        questionNode: SAssessmentQuestionNode,
        answers: number[],
        options: SAssessmentQueryOption[]
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
        node: SAssessmentMessageNode,
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
        node: SAssessmentQuestionNode,
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
        node: SAssessmentQuestionNode,
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

    static toIntegerAnswerDto(
        assessmentId: uuid,
        node: SAssessmentQuestionNode,
        field: string,
        value: number
    ): IntegerQueryAnswer {
        var dto: IntegerQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Text,
            Field            : field,
            Value            : value
        };
        return dto;
    }

    static toFloatAnswerDto(
        assessmentId: uuid,
        node: SAssessmentQuestionNode,
        field: string,
        value: number
    ): FloatQueryAnswer {
        var dto: FloatQueryAnswer = {
            AssessmentId     : assessmentId,
            NodeId           : node.id,
            QuestionSequence : node.Sequence,
            NodeDisplayCode  : node.DisplayCode,
            Title            : node.Title,
            ResponseType     : QueryResponseType.Text,
            Field            : field,
            Value            : value
        };
        return dto;
    }

}
