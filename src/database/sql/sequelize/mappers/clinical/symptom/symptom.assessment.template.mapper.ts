import SymptomAssessmentTemplate from '../../../models/clinical/symptom/symptom.assessment.template.model';
import { SymptomAssessmentTemplateDto, TemplateSymptomTypesDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.dto';
import SymptomTypesInTemplate from '../../../models/clinical/symptom/symptom.types.in.template.model';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateMapper {

    static toDto = (
        template: SymptomAssessmentTemplate,
        symptomTypes?: SymptomTypesInTemplate[]): SymptomAssessmentTemplateDto => {

        if (template == null){
            return null;
        }

        const dto: SymptomAssessmentTemplateDto = {
            id                   : template.id,
            Title                : template.Title,
            Description          : template.Description,
            Tags                 : template.Tags ? JSON.parse(template.Tags) : [],
            TemplateSymptomTypes : symptomTypes ?
                SymptomAssessmentTemplateMapper.toTemplateSymptomTypesDtos(symptomTypes) : [],
        };

        return dto;
    }

    static toTemplateSymptomTypesDtos =
        (symptomTypes: SymptomTypesInTemplate[]): TemplateSymptomTypesDto[] => {

            return symptomTypes.map(x => {
                var d: TemplateSymptomTypesDto = {
                    Index         : x.Index,
                    SymptomTypeId : x.SymptomTypeId,
                    Symptom       : null,
                    Description   : null
                };
                return d;
            });
        }

}
