import { uuid } from "../../miscellaneous/system.types";
import {
    BiometricQueryAnswer,
    DateQueryAnswer,
    FileQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
} from './assessment.types';
import { AssessmentQueryDto } from "./assessment.query.dto";

export interface AssessmentQuestionResponseDto {
    AssessmentId?: uuid;
    Parent?      : AssessmentQueryDto;
    Next?        : AssessmentQueryDto | AssessmentQueryDto[];
    Answer?      :
        | SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | DateQueryAnswer
        | IntegerQueryAnswer
        | FloatQueryAnswer
        | FileQueryAnswer
        | BiometricQueryAnswer;
}
