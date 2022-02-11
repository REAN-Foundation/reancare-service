import { MedicalConditionDto } from '../../../../../domain.types/clinical/medical.condition/medical.condition.dto';
import MedicalConditionModel from '../../models/clinical/medical.condition.model';

///////////////////////////////////////////////////////////////////////////////////

export class MedicalConditionMapper {

    static toDto = (
        medicalCondition: MedicalConditionModel): MedicalConditionDto => {
        if (medicalCondition == null) {
            return null;
        }
        const dto: MedicalConditionDto = {
            id          : medicalCondition.id,
            EhrId       : medicalCondition.EhrId,
            Condition   : medicalCondition.Condition,
            Description : medicalCondition.Description,
            Language    : medicalCondition.Language,
        };
        return dto;
    };

}
