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
import { AssessmentLabRecordsHelper } from './assessment.lab.records.helper';
import { AssessmentVitalsHelper } from './assessment.vitals.helper';
import { AssessmentNutritionHelper } from './assessment.nutrition.helper';
import { AssessmentExerciseHelper } from './assessment.exercise.helper';
import { AssessmentSymptomsHelper } from './assessment.symptoms.helper';
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
        try {
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
                else if (subCategory === 'LabRecords') {
                    const labRecordsHelper = Injector.Container.resolve(AssessmentLabRecordsHelper);
                    await labRecordsHelper.persist(assessment, questionNode, fieldName, FieldIdentifierUnit, answerDto);
                }
                else if (subCategory === 'Vitals') {
                    const labRecordsHelper = Injector.Container.resolve(AssessmentVitalsHelper);
                    await labRecordsHelper.persist(assessment, questionNode, fieldName, FieldIdentifierUnit, answerDto);
                }
                else if (subCategory === 'Symptoms') {
                    const symptomsHelper = Injector.Container.resolve(AssessmentSymptomsHelper);
                    await symptomsHelper.persist(assessment, questionNode, fieldName, FieldIdentifierUnit, answerDto);
                }
            }
            else if (category === 'Wellness') {
                if (subCategory === 'Nutrition') {
                    const nutritionHelper = Injector.Container.resolve(AssessmentNutritionHelper);
                    await nutritionHelper.persist(assessment, questionNode, fieldName, FieldIdentifierUnit, answerDto);
                }
                else if (subCategory === 'Exercise') {
                    const exerciseHelper = Injector.Container.resolve(AssessmentExerciseHelper);
                    await exerciseHelper.persist(assessment, questionNode, fieldName, FieldIdentifierUnit, answerDto);
                }
            }
        }
        catch (error) {
            Logger.instance().log(error);
        }
    };

}
