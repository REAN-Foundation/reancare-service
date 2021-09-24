import SymptomAssessmentTemplate from '../../../models/clinical/symptom/symptom.assessment.template.model';
import { SymptomAssessmentTemplateDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.dto';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateMapper {

    static toDto = (address: SymptomAssessmentTemplate): SymptomAssessmentTemplateDto => {
        if (address == null){
            return null;
        }
        const longitude: string = address.Longitude ? address.Longitude.toString() : null;
        const lattitude: string = address.Lattitude ? address.Lattitude.toString() : null;

        const dto: SymptomAssessmentTemplateDto = {
            id                            : address.id,
            Type                          : address.Type,
            SymptomAssessmentTemplateLine : address.SymptomAssessmentTemplateLine,
            City                          : address.City,
            District                      : address.District,
            State                         : address.State,
            Country                       : address.Country,
            PostalCode                    : address.PostalCode,
            Longitude                     : longitude ? parseFloat(longitude) : null,
            Lattitude                     : lattitude ? parseFloat(lattitude) : null,
        };
        return dto;
    }

}
