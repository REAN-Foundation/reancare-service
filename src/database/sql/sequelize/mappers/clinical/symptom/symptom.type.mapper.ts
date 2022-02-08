import SymptomType from '../../../models/clinical/symptom/symptom.type.model';
import { SymptomTypeDto } from '../../../../../../domain.types/clinical/symptom/symptom.type/symptom.type.dto';

///////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeMapper {

    static toDto = (symptomType: SymptomType): SymptomTypeDto => {

        if (symptomType == null){
            return null;
        }

        const dto: SymptomTypeDto = {
            id              : symptomType.id,
            EhrId           : symptomType.EhrId,
            Symptom         : symptomType.Symptom,
            Description     : symptomType.Description,
            Tags            : symptomType.Tags ? JSON.parse(symptomType.Tags) : [],
            Language        : symptomType.Language,
            ImageResourceId : symptomType.ImageResourceId,
        };
        
        return dto;
    };

}
