import { uuid } from "../../miscellaneous/system.types";
import { AssessmentAnswerDto } from "./assessment.answer.dto";
import { AssessmentMessageDto } from "./assessment.message.dto";
import { AssessmentQuestionDto } from "./assessment.question.dto";

export interface AssessmentQuestionResponseDto {
    AssessmentId?  : uuid;
    ParentQuestion : AssessmentQuestionDto;
    ProvidedAnswer?: AssessmentAnswerDto;
    IsNextQuestion?: boolean;
    NextQuestion?  : AssessmentQuestionDto;
    Message?       : AssessmentMessageDto;
}
