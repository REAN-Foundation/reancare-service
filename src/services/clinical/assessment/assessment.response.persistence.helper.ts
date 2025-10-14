import { inject, injectable } from 'tsyringe';
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
    SkipQueryAnswer,
    AssessmentType
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
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { AssessmentHelperService } from './assessment.helper';
import { AssessmentValidator } from '../../../api/clinical/assessment/assessment/assessment.validator';
import { IAssessmentRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface';
import { IAssessmentHelperRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentResponsePersistenceHelper {

    _assessmentValidator: AssessmentValidator = new AssessmentValidator();

    constructor(
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
    ) {
    }

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
            
            const userId = await this.resolveTargetPatientUserId(assessment);
            assessment.PatientUserId = userId;

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

    private resolveTargetPatientUserId = async (assessment: AssessmentDto): Promise<string> => {
        try {
            if (assessment.Type !== AssessmentType.Clinical) {
                return assessment.PatientUserId;
            }
            const assessmentData = await this._assessmentRepo.getById(assessment.id);
            const responses = await this._assessmentHelperRepo.getUserResponses(assessment.id);
            assessmentData.UserResponses = responses;
            const userData = AssessmentHelperService.extractFieldIdentifierData(assessmentData);

            //Expecting user name in the form of EMRId as a field identifier
            const userName = this._assessmentValidator.validateAssessmentTargetUser(userData);
            if (!userName) {
                return assessment.PatientUserId;
            }
            const user = await this._userRepo.getByUserName(userName);
            if (user) {
                return user.id;
            }
            return assessment.PatientUserId;
        }
        catch (error) {
            Logger.instance().log(error);
            return assessment.PatientUserId;
        }
    };

}
