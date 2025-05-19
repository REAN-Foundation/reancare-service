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
    SkipQueryAnswer
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

        const userId = assessment.PatientUserId;
        const user = await this._userRepo.getById(userId);
        const personId = user.PersonId;
        if (!personId) {
            Logger.instance().log(`No person found for user ${userId}`);
            return;
        }

    };

}
