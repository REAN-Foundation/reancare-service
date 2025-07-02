import { Logger } from '../../../common/logger';
import { inject, injectable } from 'tsyringe';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import {
    BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    QueryResponseType,
    CAssessmentQuestionNode,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
    DateQueryAnswer,
    FileQueryAnswer,
    BooleanQueryAnswer,
    SkipQueryAnswer
} from '../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { parse } from 'path';
import { Gender } from '../../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentPersonalProfileHelper {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
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

            if (fieldName === 'FirstName' && answer.ResponseType === QueryResponseType.Text) {
                const a = answer as TextQueryAnswer;
                const name = a.Text;
                const person = await this._personRepo.update(personId, {
                    FirstName : name,
                });
            } else if (fieldName === 'LastName') {
                const a = answer as TextQueryAnswer;
                const name = a.Text;
                const person = await this._personRepo.update(personId, {
                    LastName : name,
                });
            } else if (fieldName === 'Name') {
                
                const a = answer as TextQueryAnswer;
                const name = a.Text;
                const tokens = name.split(' ');
                if (tokens.length < 2) {
                    Logger.instance().log(`Invalid name format: ${name}`);
                    const person = await this._personRepo.update(personId, {
                        FirstName : name,
                    });
                }
                const firstName = tokens[0];
                const lastName = tokens.slice(1).join(' ');
                const person = await this._personRepo.update(personId, {
                    FirstName : firstName,
                    LastName  : lastName,
                });
            }
            else if (fieldName === 'Age') {
                const respType = answer.ResponseType;
                let personAge = null;
                let age = null;
                if (respType === QueryResponseType.SingleChoiceSelection) {
                    const a = answer as SingleChoiceQueryAnswer;
                    const options = node.Options;
                    const selectedOption = options.find((option) => option.Sequence === a.ChosenSequence);
                    const fieldValue = selectedOption?.Text;
                    if (fieldValue) {
                        personAge = fieldValue;
                    }
                }
                else if (respType === QueryResponseType.Integer) {
                    const a = answer as IntegerQueryAnswer;
                    personAge = String(a.Value); //a.Value;

                }
                if (personAge.includes('-')) // check if age is a range
                {
                    const [minAge, maxAge] = personAge.split('-').map(Number);
                    personAge  = String( (minAge + maxAge) / 2);
                }
                age = parseInt(personAge.replace(/[^0-9.]/g, ''));
                const now = new Date();
                const dob = now.setFullYear(now.getFullYear() - age, 0, 1);
                const dateOfBirth = new Date(dob);
                const personDob = await this._personRepo.update(personId, {
                    BirthDate : dateOfBirth,
                });
                const personsAge = await this._personRepo.update(personId, {
                    Age : String(age),
                });
            } 
            else if (fieldName === 'DateOfBirth') {
                const a = answer as DateQueryAnswer;
                const dateOfBirth = a.Date;
                if (dateOfBirth) {
                    const person = await this._personRepo.update(personId, {
                        BirthDate : dateOfBirth,
                    });
                }
            } else if (fieldName === 'Gender') {
                const respType = answer.ResponseType;
                let gender = null;
                if (respType === QueryResponseType.SingleChoiceSelection) {
                    const a = answer as SingleChoiceQueryAnswer;
                    const options = node.Options;
                    const selectedOption = options.find((option) => option.Sequence === a.ChosenSequence);
                    const fieldValue = selectedOption?.Text;
                    if (fieldValue) {
                        gender = fieldValue;
                    }
                }
                else if (respType === QueryResponseType.Text) {
                    const a = answer as TextQueryAnswer;
                    gender = a.Text;
                }
                if (gender) {
                    if (gender && !(gender in Gender)) {
                        gender = Gender.Unknown;
                    }
                    const person = await this._personRepo.update(personId, {
                        Gender : gender,
                    });
                }
            }

        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
