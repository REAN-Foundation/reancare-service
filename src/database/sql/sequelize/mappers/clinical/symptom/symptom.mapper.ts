import Symptom from '../../../models/clinical/symptom/symptom.assessment.model';
import { SymptomDto } from '../../../../../../domain.types/clinical/symptom/symptom/symptom.dto';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomMapper {

    static toDto = (address: Symptom): SymptomDto => {
        if (address == null){
            return null;
        }
        const longitude: string = address.Longitude ? address.Longitude.toString() : null;
        const lattitude: string = address.Lattitude ? address.Lattitude.toString() : null;

        const dto: SymptomDto = {
            id          : address.id,
            Type        : address.Type,
            SymptomLine : address.SymptomLine,
            City        : address.City,
            District    : address.District,
            State       : address.State,
            Country     : address.Country,
            PostalCode  : address.PostalCode,
            Longitude   : longitude ? parseFloat(longitude) : null,
            Lattitude   : lattitude ? parseFloat(lattitude) : null,
        };
        return dto;
    }

}
