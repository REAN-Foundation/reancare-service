import MedicalConditionModel from '../../models/static.types/medical.condition.model';
import { MedicalConditionDto } from '../../../../../domain.types/static.types/medical.condition/medical.condition.dto';

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
    }

}
