import SymptomAssessment from '../../../models/clinical/symptom/symptom.assessment.model';
import { SymptomAssessmentDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.dto';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentMapper {

    static toDto = (address: SymptomAssessment): SymptomAssessmentDto => {
        if (address == null){
            return null;
        }
        const longitude: string = address.Longitude ? address.Longitude.toString() : null;
        const lattitude: string = address.Lattitude ? address.Lattitude.toString() : null;

        const dto: SymptomAssessmentDto = {
            id                    : address.id,
            Type                  : address.Type,
            SymptomAssessmentLine : address.SymptomAssessmentLine,
            City                  : address.City,
            District              : address.District,
            State                 : address.State,
            Country               : address.Country,
            PostalCode            : address.PostalCode,
            Longitude             : longitude ? parseFloat(longitude) : null,
            Lattitude             : lattitude ? parseFloat(lattitude) : null,
        };
        return dto;
    }

}
