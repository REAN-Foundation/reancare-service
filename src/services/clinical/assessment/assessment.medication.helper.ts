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
    SkipQueryAnswer,
    QueryResponseType
} from '../../../domain.types/clinical/assessment/assessment.types';
import { MedicationDomainModel } from '../../../domain.types/clinical/medication/medication/medication.domain.model';
import { IMedicationRepo } from '../../../database/repository.interfaces/clinical/medication/medication.repo.interface';
import { MedicationFrequencyUnits } from '../../../domain.types/clinical/medication/medication/medication.types';
import { MedicationDosageUnits } from '../../../domain.types/clinical/medication/medication/medication.types';

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
                const drugName = a.Text;
                const medicationRecord : MedicationDomainModel = {
                    PatientUserId : userId,
                    DrugName     : drugName,
                };
                
                const personMedication = await this._medicationRepo.create(medicationRecord);
            }
            if (fieldName === 'Frequency') {
                const respType = answer.ResponseType;
                let frequency = null;
                if (respType === QueryResponseType.SingleChoiceSelection) {
                     const a = answer as SingleChoiceQueryAnswer;
                     const options = node.Options;
                     const selectedOption = options.find((option) => option.Sequence === a.ChosenSequence);
                     const fieldValue = selectedOption?.Text;
                      if (fieldValue) {
                        frequency = fieldValue;
                    }
                }
                else if (respType === QueryResponseType.Text) {
                    const a = answer as TextQueryAnswer;
                    frequency = a.Text;
                }
                const medicationFrequencyRecord : MedicationDomainModel = {
                    PatientUserId : userId,
                    FrequencyUnit : frequency as MedicationFrequencyUnits ?? null
                };
                
                const personMedicationFrequency = await this._medicationRepo.create(medicationFrequencyRecord);
            }
            else if (fieldName === 'Duration') {
                const a = answer as IntegerQueryAnswer;
                const duration = a.Value;
                const medicationDurationRecord : MedicationDomainModel = {
                    PatientUserId : userId,
                    Duration      : duration
                };
                const personMedicationDuration = await this._medicationRepo.create(medicationDurationRecord);
            }

            else if (fieldName === 'Unit') {
                const a = answer as IntegerQueryAnswer;
                const dose = a.Value;
                const medicationUnitRecord : MedicationDomainModel = {
                    PatientUserId : userId,
                    Dose          : dose,
                    DosageUnit: (FieldIdentifierUnit as MedicationDosageUnits) ?? MedicationDosageUnits.Unit
                };
                const personMedicationUnit = await this._medicationRepo.create(medicationUnitRecord);
                
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
