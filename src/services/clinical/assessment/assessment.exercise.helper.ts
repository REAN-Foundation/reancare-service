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
import { PhysicalActivityDomainModel } from '../../../domain.types/wellness/exercise/physical.activity/physical.activity.domain.model';
import { IPhysicalActivityRepo } from '../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface';
@injectable()
export class AssessmentExerciseHelper {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo
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

            if (fieldName === 'StandingDuration') {
                const a = answer as IntegerQueryAnswer;
                const standing = a.Value;
                const exerciseRecord : PhysicalActivityDomainModel = {
                    PatientUserId : userId,
                    Exercise      : 'Standing',
                    Provider      : assessment.Provider,
                    DurationInMin : standing
                };
                
                const personStanding = await this._physicalActivityRepo.create(exerciseRecord);
            }
             else if (fieldName === 'ExerciseDuration') {
                const a = answer as IntegerQueryAnswer;
                const exercise = a.Value;
                const exerciseRecord : PhysicalActivityDomainModel = {
                    PatientUserId : userId,
                    Exercise      : 'Exercise',
                    Provider      : assessment.Provider,
                    DurationInMin : exercise
                };
                
                const personStanding = await this._physicalActivityRepo.create(exerciseRecord);
            }

        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
