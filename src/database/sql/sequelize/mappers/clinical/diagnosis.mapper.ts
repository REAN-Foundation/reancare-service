import { DiagnosisDto } from '../../../../../domain.types/clinical/diagnosis/diagnosis.dto';
import { ClinicalInterpretation, ClinicalValidationStatus } from '../../../../../domain.types/miscellaneous/clinical.types';
import Diagnosis from '../../models/clinical/diagnosis.model';

///////////////////////////////////////////////////////////////////////////////////

export class DiagnosisMapper {

    static toDto = (diagnosis: Diagnosis): DiagnosisDto => {
        if (diagnosis == null){
            return null;
        }

        const dto: DiagnosisDto = {
            id                        : diagnosis.id,
            EhrId                     : diagnosis.EhrId,
            Patient                   : null,
            MedicalPractitionerUserId : diagnosis.MedicalPractitionerUserId,
            VisitId                   : diagnosis.VisitId,
            MedicalCondition          : null,
            ValidationStatus          : diagnosis.ValidationStatus as ClinicalValidationStatus,
            Interpretation            : diagnosis.Interpretation as ClinicalInterpretation,
            Comments                  : diagnosis.Comments,
            IsClinicallyActive        : diagnosis.IsClinicallyActive,
            OnsetDate                 : diagnosis.OnsetDate,
            EndDate                   : diagnosis.EndDate,
        };
        return dto;
    };

}
