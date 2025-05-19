import { injectable } from 'tsyringe';
import { Logger } from '../../../common/logger';
import { AssessmentBiometricsHelper } from './assessment.biometrics.helper';
import { Injector } from '../../../startup/injector';
import {
    BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer, QueryResponseType,
    CAssessmentMessageNode,
    CAssessmentQuestionNode,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
    DateQueryAnswer,
    FileQueryAnswer,
    BooleanQueryAnswer,
    SkipQueryAnswer
} from '../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentFieldIdentifiers } from '../../../domain.types/clinical/assessment/assessment.field.identifiers';
import { AssessmentPersonalProfileHelper } from './assessment.personal.profile.helper';
import { AssessmentHealthProfileHelper } from './assessment.health.profile.helper';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentResponsePersistenceHelper {

    public persist = async (
        assessment: AssessmentDto,
        node: CAssessmentQuestionNode | CAssessmentMessageNode,
        answerDto: | SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | DateQueryAnswer
        | IntegerQueryAnswer
        | BooleanQueryAnswer
        | FloatQueryAnswer
        | FileQueryAnswer
        | BiometricQueryAnswer
        | SkipQueryAnswer
    ) => {
        if (answerDto.ResponseType === QueryResponseType.Biometrics) {
            const biometricsHelper = Injector.Container.resolve(AssessmentBiometricsHelper);
            const biometrics = answerDto as BiometricQueryAnswer;
            await biometricsHelper.persistBiometrics(assessment.PatientUserId, biometrics);
        }
        const questionNode = node as CAssessmentQuestionNode;
        const fieldIdentifier = questionNode.FieldIdentifier;
        const FieldIdentifierUnit = questionNode.FieldIdentifierUnit;
        const field = AssessmentFieldIdentifiers.find((x) => x === fieldIdentifier);
        if (!field) {
            Logger.instance().log('Unsupported field identifier ...');
        }

        const tokens = field.split(':');
        const category = tokens[0];
        const subCategory = tokens[1];
        const fieldName = tokens[2];

        if (category === 'General') {
            if (subCategory === 'PersonalProfile') {
                const personalProfileHelper = Injector.Container.resolve(AssessmentPersonalProfileHelper);
                await personalProfileHelper.persist(assessment, questionNode, fieldName, answerDto);
            }
        }
        else if (category === 'Clinical') {
            if (subCategory === 'HealthProfile') {
                const healthProfileHelper = Injector.Container.resolve(AssessmentHealthProfileHelper);
                await healthProfileHelper.persist(assessment, questionNode, fieldName, answerDto);
            }
           
        }
    };
}
