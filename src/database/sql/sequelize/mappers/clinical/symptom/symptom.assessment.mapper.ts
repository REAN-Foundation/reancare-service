import SymptomAssessment from '../../../models/clinical/symptom/symptom.assessment.model';
import { SymptomAssessmentDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.dto';
import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
import Symptom from '../../../models/clinical/symptom/symptom.model';
import { SymptomMapper } from './symptom.mapper';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentMapper {

    static toDto = (assessment: SymptomAssessment, symptoms?: Symptom[]): SymptomAssessmentDto => {

        if (assessment == null){
            return null;
        }

        const dto: SymptomAssessmentDto = {
            id                   : assessment.id,
            EhrId                : assessment.EhrId,
            PatientUserId        : assessment.PatientUserId,
            Title                : assessment.Title,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            OverallStatus        : assessment.OverallStatus as ProgressStatus,
            AssessmentDate       : assessment.AssessmentDate,
            SymptomsRecorded     : symptoms && symptoms.length > 0 ? symptoms.map( x=> SymptomMapper.toDto(x)) : []
        };
        return dto;
    };

}
