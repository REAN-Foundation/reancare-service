import SymptomType from '../../../models/clinical/symptom/symptom.type.model';
import { SymptomTypeDto } from '../../../../../../domain.types/clinical/symptom/symptom.type/symptom.type.dto';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeMapper {

    static toDto = (symptomType: SymptomType): SymptomTypeDto => {

        if (symptomType == null){
            return null;
        }

        var tags = [];
        if (symptomType.Tags !== null && symptomType.Tags !== undefined) {
            tags = JSON.parse(symptomType.Tags);
        }

        const dto: SymptomTypeDto = {
            id              : symptomType.id,
            EhrId           : symptomType.EhrId,
            Symptom         : symptomType.Symptom,
            Description     : symptomType.Description,
            Tags            : tags,
            Language        : symptomType.Language,
            ImageResourceId : symptomType.ImageResourceId,
            CreatedAt       : symptomType.CreatedAt,
        };
        
        return dto;
    };

}
