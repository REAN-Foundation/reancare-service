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
import { LabRecordDomainModel } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.domain.model';
import { ILabRecordRepo } from '../../../database/repository.interfaces/clinical/lab.record/lab.record.interface';
import { LabRecordType } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.types';
@injectable()
export class AssessmentLabRecordsHelper {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
        @inject('ILabRecordRepo') private _labRecordRepo: ILabRecordRepo
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

            if (fieldName === 'Cholesterol') {
                const a = answer as IntegerQueryAnswer;
                const cholesterol = a.Value;
                const labRecordType = await this._labRecordRepo.getTypeByDisplayName(LabRecordType.TotalCholesterol);
                const labRecord : LabRecordDomainModel = {
                    PatientUserId : userId,
                    TypeName      : 'Cholesterol',
                    TypeId        : labRecordType.id,
                    PrimaryValue  : cholesterol,
                    Unit          : FieldIdentifierUnit ?? 'mg/dL',
                    RecordedAt    : new Date(),
                    DisplayName   : LabRecordType.TotalCholesterol
                };
                
                const personCholesterol = await this._labRecordRepo.create(labRecord);
            }

            else if (fieldName === 'Triglycerides') {
                const a = answer as IntegerQueryAnswer;
                const triglycerides = a.Value;
                const labRecordType = await this._labRecordRepo.getTypeByDisplayName(LabRecordType.TriglycerideLevel);
                const labRecord : LabRecordDomainModel = {
                    PatientUserId : userId,
                    TypeName      : 'Cholesterol',
                    TypeId        : labRecordType.id,
                    PrimaryValue  : triglycerides,
                    Unit          : FieldIdentifierUnit ?? 'mg/dL',
                    RecordedAt    : new Date(),
                    DisplayName   : LabRecordType.TriglycerideLevel
                };
                const personTriglycerides = await this._labRecordRepo.create(labRecord);
            }

            else if (fieldName === 'LDL') {
                const a = answer as IntegerQueryAnswer;
                const ldl = a.Value;
                const labRecordType = await this._labRecordRepo.getTypeByDisplayName(fieldName);
                const labRecord : LabRecordDomainModel = {
                    PatientUserId : userId,
                    TypeName      : 'Cholesterol',
                    TypeId        : labRecordType.id,
                    PrimaryValue  : ldl,
                    Unit          : FieldIdentifierUnit ?? 'mg/dL',
                    RecordedAt    : new Date(),
                    DisplayName   : fieldName
                };
                const personLdl = await this._labRecordRepo.create(labRecord);
            }

            else if (fieldName === 'HDL') {
                const a = answer as IntegerQueryAnswer;
                const hdl = a.Value;
                const labRecordType = await this._labRecordRepo.getTypeByDisplayName(fieldName);
                const labRecord : LabRecordDomainModel = {
                    PatientUserId : userId,
                    TypeName      : 'Cholesterol',
                    TypeId        : labRecordType.id,
                    PrimaryValue  : hdl,
                    Unit          : FieldIdentifierUnit ?? 'mg/dL',
                    RecordedAt    : new Date(),
                    DisplayName   : fieldName
                };
                const personHdl = await this._labRecordRepo.create(labRecord);
                
            }

            else if (fieldName === 'A1C') {
                const a = answer as FloatQueryAnswer;
                const a1c = a.Value;
                const displayName = fieldName + ' ' + 'Level';
                const labRecordType = await this._labRecordRepo.getTypeByDisplayName(displayName);
                const labRecord : LabRecordDomainModel = {
                    PatientUserId : userId,
                    TypeName      : 'Cholesterol',
                    TypeId        : labRecordType.id,
                    PrimaryValue  : a1c,
                    Unit          : FieldIdentifierUnit ?? '%',
                    RecordedAt    : new Date(),
                    DisplayName   : displayName
                };
                const personA1c = await this._labRecordRepo.create(labRecord);
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
