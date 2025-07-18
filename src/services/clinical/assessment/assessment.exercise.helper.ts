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
import { StepCountDomainModel } from '../../../domain.types/wellness/daily.records/step.count/step.count.domain.model';
import { IStepCountRepo } from '../../../database/repository.interfaces/wellness/daily.records/step.count.interface';
import { StandDomainModel } from '../../../domain.types/wellness/daily.records/stand/stand.domain.model';
import { IStandRepo } from '../../../database/repository.interfaces/wellness/daily.records/stand.repo.interface';

@injectable()
export class AssessmentExerciseHelper {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo,
        @inject('IStepCountRepo') private _stepCountRepo: IStepCountRepo,
        @inject('IStandRepo') private _standRepo: IStandRepo
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
                const standingRecord : StandDomainModel = {
                    PatientUserId : userId,
                    Stand         : standing,
                    Unit          : 'minutes',
                    RecordDate    : new Date()
                };
                
                const personStanding = await this._standRepo.create(standingRecord);
            }
             else if (fieldName === 'StepCount') {
                const a = answer as IntegerQueryAnswer;
                const stepCount = a.Value;
                const stepCountRecord : StepCountDomainModel = {
                    PatientUserId : userId,
                    Provider      : assessment.Provider,
                    StepCount     : stepCount,
                    Unit          : 'steps',
                    RecordDate    : new Date()
                };
                
                const personStepCount = await this._stepCountRepo.create(stepCountRecord);
            }
             else if (fieldName === 'ExerciseDuration') {
                const a = answer as IntegerQueryAnswer;
                const exercise = a.Value;
                const exerciseDurationRecord : PhysicalActivityDomainModel = {
                    PatientUserId : userId,
                    Exercise      : 'Exercise',
                    Provider      : assessment.Provider,
                    DurationInMin : exercise
                };
                
                const personExerciseDuration = await this._physicalActivityRepo.create(exerciseDurationRecord);
            }

        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
