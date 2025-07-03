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
import { MedicationDomainModel } from '../../../domain.types/clinical/medication/medication/medication.domain.model';
import { IMedicationRepo } from '../../../database/repository.interfaces/clinical/medication/medication.repo.interface';
@injectable()
export class AssessmentMedicationHelper {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo
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

            if (fieldName === 'DrugName') {
                const a = answer as TextQueryAnswer;
                const drug_name = a.Text;
                const medicationRecord : MedicationDomainModel = {
                    PatientUserId : userId,
                    DrugName     : drug_name,
                };
                
                const personMedication = await this._medicationRepo.create(medicationRecord);
            }
            if (fieldName === 'Frequency') {
                const a = answer as SingleChoiceQueryAnswer;
                const frequency = a.ChosenOption;
                const medicationRecord : MedicationDomainModel = {
                    PatientUserId : userId,
                    FrequencyUnit : frequency,
                };
                
                const personMedication = await this._medicationRepo.create(medicationRecord);
            }
            else if (fieldName === 'Duration') {
                const a = answer as IntegerQueryAnswer;
                const duration = a.Value;
                const medicationRecord : MedicationDomainModel = {
                    PatientUserId : userId,
                    Duration      : duration
                };
                const personLdl = await this._medicationRepo.create(medicationRecord);
            }

            else if (fieldName === 'Unit') {
                const a = answer as IntegerQueryAnswer;
                const hdl = a.Value;
                const medicationRecord : MedicationDomainModel = {
                    PatientUserId : userId,
                    Dose          : ,
                    DosageUnit    : 
                };
                const personMedication = await this._medicationRepo.create(medicationRecord);
                
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
