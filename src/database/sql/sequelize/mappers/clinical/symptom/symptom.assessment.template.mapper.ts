import { SymptomAssessmentTemplateDto, TemplateSymptomTypesDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.dto';
import SymptomAssessmentTemplate from '../../../models/clinical/symptom/symptom.assessment.template.model';
import SymptomTypesInTemplate from '../../../models/clinical/symptom/symptom.types.in.template.model';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateMapper {

    static toDto = (
        template: SymptomAssessmentTemplate,
        symptomTypes?: SymptomTypesInTemplate[]): SymptomAssessmentTemplateDto => {

        if (template == null){
            return null;
        }

        var types = [];
        if (symptomTypes) {
            types = SymptomAssessmentTemplateMapper.toTemplateSymptomTypesDtos(symptomTypes);
        }
        else {
            var list = template.SymptomTypes;
            types =  list && list.length > 0 ? list.map(x => {
                var y: any = x;
                var index = y.SymptomTypesInTemplate.Index;
                var d: TemplateSymptomTypesDto = {
                    Index           : index,
                    SymptomTypeId   : x.id,
                    Symptom         : x.Symptom,
                    Description     : x.Description,
                    ImageResourceId : x.ImageResourceId
                };
                return d;
            }) : [];

            if (types.length > 0) {
                types = types.sort((a, b) => a.Index - b.Index);
            }
        }

        const dto: SymptomAssessmentTemplateDto = {
            id                   : template.id,
            Title                : template.Title,
            Description          : template.Description,
            Tags                 : template.Tags ? JSON.parse(template.Tags) : [],
            TemplateSymptomTypes : types,
        };

        return dto;
    };

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
        };

}
