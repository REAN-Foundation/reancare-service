import { uuid } from "../../miscellaneous/system.types";
import { AssessmentAnswerDto } from "./assessment.answer.dto";
import { AssessmentMessageDto } from "./assessment.message.dto";
import { AssessmentQueryDto } from "./assessment.query.dto";

export interface AssessmentQuestionResponseDto {
    AssessmentId?  : uuid;
    ParentQuestion : AssessmentQueryDto;
    ProvidedAnswer?: AssessmentAnswerDto;
    IsNextQuestion?: boolean;
    NextQuestion?  : AssessmentQueryDto;
    Message?       : AssessmentMessageDto;
}
