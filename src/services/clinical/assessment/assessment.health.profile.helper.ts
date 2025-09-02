import { Logger } from '../../../common/logger';
import { inject, injectable } from 'tsyringe';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import {
    BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    CAssessmentQuestionNode,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
    DateQueryAnswer,
    FileQueryAnswer,
    BooleanQueryAnswer,
    SkipQueryAnswer,
    QueryResponseType
} from '../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { IHealthProfileRepo } from '../../../database/repository.interfaces/users/patient/health.profile.repo.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentHealthProfileHelper {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IHealthProfileRepo') private _healthProfileRepo: IHealthProfileRepo,
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
    ) {
    }

    public persist = async (
        assessment: AssessmentDto,
        node: CAssessmentQuestionNode,
        fieldName: string,
        answer: SingleChoiceQueryAnswer
            | MultipleChoiceQueryAnswer
            | MessageAnswer
            | TextQueryAnswer
            | DateQueryAnswer
            | IntegerQueryAnswer
            | BooleanQueryAnswer
            | FloatQueryAnswer
            | FileQueryAnswer
            | BiometricQueryAnswer
            | SkipQueryAnswer) => {
        try {
            const userId = assessment.PatientUserId;
            const user = await this._userRepo.getById(userId);
            const personId = user.PersonId;
            if (!personId) {
                Logger.instance().log(`No person found for user ${userId}`);
                return;
            }

            if (fieldName === 'BloodGroup') {
                const respType = answer.ResponseType;
                let bloodGroup = null;
                if (respType === QueryResponseType.SingleChoiceSelection) {
                    const a = answer as SingleChoiceQueryAnswer;
                    const options = node.Options;
                    const selectedOption = options.find((option) => option.Sequence === a.ChosenSequence);
                    const fieldValue = selectedOption?.Text;
                    if (fieldValue) {
                        bloodGroup = fieldValue;
                    }
                }
                else if (respType === QueryResponseType.Text) {
                    const a = answer as TextQueryAnswer;
                    bloodGroup = a.Text;
                }
                if (bloodGroup) {
                    await this._healthProfileRepo.updateByPatientUserId(userId, {
                        BloodGroup : bloodGroup,
                    });
                }
            }

            else if (fieldName === 'Ethnicity') {
                const respType = answer.ResponseType;
                let ethnicity = null;
                if (respType === QueryResponseType.SingleChoiceSelection) {
                    const a = answer as SingleChoiceQueryAnswer;
                    const options = node.Options;
                    const selectedOption = options.find((option) => option.Sequence === a.ChosenSequence);
                    const fieldValue = selectedOption?.Text;
                    if (fieldValue) {
                        ethnicity = fieldValue;
                    }
                }
                else if (respType === QueryResponseType.Text) {
                    const a = answer as TextQueryAnswer;
                    ethnicity = a.Text;
                }
                if (ethnicity) {
                    await this._healthProfileRepo.updateByPatientUserId(userId, {
                        Ethnicity : ethnicity,
                    });
                }
            }
            else if (fieldName === 'Race')  {
                const respType = answer.ResponseType;
                let race = null;
                if (respType === QueryResponseType.SingleChoiceSelection) {
                    const a = answer as SingleChoiceQueryAnswer;
                    const options = node.Options;
                    const selectedOption = options.find((option) => option.Sequence === a.ChosenSequence);
                    const fieldValue = selectedOption?.Text;
                    if (fieldValue) {
                        race = fieldValue;
                    }
                }
                else if (respType === QueryResponseType.Text) {
                    const a = answer as TextQueryAnswer;
                    race = a.Text;
                }
                if (race) {
                    await this._healthProfileRepo.updateByPatientUserId(userId, {
                        Race : race,
                    });
                }
            }
                
            else if (fieldName === 'MaritalStatus'){
                const respType = answer.ResponseType;
                let maritalStatus = null;
                if (respType === QueryResponseType.SingleChoiceSelection) {
                    const a = answer as SingleChoiceQueryAnswer;
                    const options = node.Options;
                    const selectedOption = options.find((option) => option.Sequence === a.ChosenSequence);
                    const fieldValue = selectedOption?.Text;
                    if (fieldValue) {
                        maritalStatus = fieldValue;
                    }
                }
                else if (respType === QueryResponseType.Text) {
                    const a = answer as TextQueryAnswer;
                    maritalStatus = a.Text;
                }
                if (maritalStatus) {
                    await this._healthProfileRepo.updateByPatientUserId(userId, {
                        MaritalStatus : maritalStatus,
                    });
                }
            }
            else if (fieldName === 'Occupation' && answer.ResponseType === QueryResponseType.Text) {
                const a = answer as TextQueryAnswer;
                const occupation = a.Text;
                await this._healthProfileRepo.updateByPatientUserId(userId, {
                    Occupation : occupation,
                });
            }
            else if (fieldName === 'Smoking' && answer.ResponseType === QueryResponseType.Boolean) {
                const respType = answer.ResponseType;
                let smokingStatus = null;
                if (respType === QueryResponseType.Boolean) {
                    const a = answer as BooleanQueryAnswer;
                    const fieldValue = a.Value;
                    if (fieldValue) {
                        smokingStatus = fieldValue;
                    }
                }
                else if (respType === QueryResponseType.Text) {
                    const a = answer as TextQueryAnswer;
                    smokingStatus = a.Text;
                }
                if (smokingStatus) {
                    await this._healthProfileRepo.updateByPatientUserId(userId, {
                        IsSmoker : smokingStatus,
                    });
                }
            }

        }
        catch (err) {
            Logger.instance().log(err);
        }
    };

}
