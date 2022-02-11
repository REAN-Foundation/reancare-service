import Symptom from '../../../models/clinical/symptom/symptom.model';
import { SymptomDto } from '../../../../../../domain.types/clinical/symptom/symptom/symptom.dto';
import { Severity } from '../../../../../../domain.types/miscellaneous/system.types';
import { ClinicalValidationStatus } from '../../../../../../domain.types/miscellaneous/clinical.types';
import { ClinicalInterpretation } from '../../../../../../domain.types/miscellaneous/clinical.types';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomMapper {

    static toDto = (symptom: Symptom): SymptomDto => {

        if (symptom == null){
            return null;
        }

        const dto: SymptomDto = {
            id                        : symptom.id,
            EhrId                     : symptom.EhrId,
            PatientUserId             : symptom.PatientUserId,
            MedicalPractitionerUserId : symptom.MedicalPractitionerUserId,
            VisitId                   : symptom.VisitId,
            AssessmentId              : symptom.AssessmentId,
            AssessmentTemplateId      : symptom.AssessmentTemplateId,
            SymptomTypeId             : symptom.SymptomTypeId,
            Symptom                   : symptom.Symptom,
            IsPresent                 : symptom.IsPresent,
            Severity                  : symptom.Severity as Severity,
            ValidationStatus          : symptom.ValidationStatus as ClinicalValidationStatus,
            Interpretation            : symptom.Interpretation as ClinicalInterpretation,
            Comments                  : symptom.Comments,
            RecordDate                : symptom.RecordDate,
        };
        
        return dto;
    };

}
