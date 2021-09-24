import SymptomType from '../../../models/clinical/symptom/symptom.type.model';
import { SymptomTypeDto } from '../../../../../../domain.types/clinical/symptom/symptom.type/symptom.type.dto';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeMapper {

    static toDto = (symptomType: SymptomType): SymptomTypeDto => {
        if (symptomType == null){
            return null;
        }
        const longitude: string = symptomType.Longitude ? symptomType.Longitude.toString() : null;
        const lattitude: string = symptomType.Lattitude ? symptomType.Lattitude.toString() : null;

        const dto: SymptomTypeDto = {
            id              : symptomType.id,
            Type            : symptomType.Type,
            SymptomTypeLine : symptomType.SymptomTypeLine,
            City            : symptomType.City,
            District        : symptomType.District,
            State           : symptomType.State,
            Country         : symptomType.Country,
            PostalCode      : symptomType.PostalCode,
            Longitude       : longitude ? parseFloat(longitude) : null,
            Lattitude       : lattitude ? parseFloat(lattitude) : null,
        };
        return dto;
    }

}
