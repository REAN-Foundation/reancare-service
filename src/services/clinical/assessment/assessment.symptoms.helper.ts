import { inject, injectable } from 'tsyringe';
import { Logger } from '../../../common/logger';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { IHealthProfileRepo } from '../../../database/repository.interfaces/users/patient/health.profile.repo.interface';
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
    SkipQueryAnswer
} from '../../../domain.types/clinical/assessment/assessment.types';
import { HowDoYouFeelDomainModel } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { IHowDoYouFeelRepo } from '../../../database/repository.interfaces/clinical/symptom/how.do.you.feel.repo.interface';
@injectable()
export class AssessmentSymptomsHelper {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
        @inject('IHowDoYouFeelRepo') private _howDoYouFeelRepo: IHowDoYouFeelRepo
    ) {
    }

    public persist = async (
        assessment: AssessmentDto, node: CAssessmentQuestionNode,
        fieldName: string, FieldIdentifierUnit: string, answer: SingleChoiceQueryAnswer |
    MultipleChoiceQueryAnswer |
    MessageAnswer |
    TextQueryAnswer |
    DateQueryAnswer |
    IntegerQueryAnswer |
    BooleanQueryAnswer |
    FloatQueryAnswer |
    FileQueryAnswer |
    BiometricQueryAnswer |
    SkipQueryAnswer) => {
        try {
            const userId = assessment.PatientUserId;
            const user = await this._userRepo.getById(userId);
            const personId = user.PersonId;
            if (!personId) {
                Logger.instance().log(`No person found for user ${userId}`);
                return;
            }

            if (fieldName === 'Symptom') {
                let feeling = null;
                const a = answer as SingleChoiceQueryAnswer;
                const options = node.Options;
                const selectedOption = options.find((option) => option.Sequence === a.ChosenSequence);
                const fieldValue = selectedOption?.Text;
                if (fieldValue) {
                    feeling = fieldValue;
                }
                const symptomRecord : HowDoYouFeelDomainModel = {
                    PatientUserId : userId,
                    Feeling       : feeling,
                    RecordDate    : new Date()
                };
                
                const personSymptom = await this._howDoYouFeelRepo.create(symptomRecord);
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
