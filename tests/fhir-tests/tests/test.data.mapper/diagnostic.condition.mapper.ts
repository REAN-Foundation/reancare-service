import path from 'path';
import { Helper } from '../../../../common/helper';
import { DiagnosticConditionDomainModel, MedicalConditionDomainModel } from '../../../../domain.types/clinical/diagnosis/diagnostic.condition.domain.model';
///////////////////////////////////////////////////////////////////////////////////

export class DiagnosticConditionMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'diagnosis.domain.model.json');
        var obj = Helper.jsonToObj(jsonPath);

        var medicalcondition: MedicalConditionDomainModel = {
            FhirId      : obj.MedicalCondition.FhirId,
            BodySite    : obj.MedicalCondition.BodySite,
            Condition   : obj.MedicalCondition.Condition,
            Description : obj.MedicalCondition.Description,
            Language    : obj.MedicalCondition.Language,
        };

        var model: DiagnosticConditionDomainModel = {
            PatientUserId         : obj.PatientUserId,
            EhrId                 : obj.EhrId,
            DoctorEhrId           : obj.DoctorEhrId,
            MedicalCondition      : medicalcondition,
            OnsetDate             : obj.OnsetDate,
            Comments              : obj.Comments,
            DoctorUserId          : obj.DoctorUserId,
            MedicalConditionId    : obj.MedicalConditionId,
            MedicalConditionEhrId : obj.MedicalConditionEhrId,
            ClinicalStatus        : obj.ClinicalStatus,
            ValidationStatus      : obj.ValidationStatus,
            Interpretation        : obj.Interpretation
        };
        return model;
    };

}
