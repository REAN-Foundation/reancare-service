import { BabyDto } from '../../../../../../domain.types/clinical/maternity/baby/baby.dto';
import BabyModel from '../../../models/clinical/maternity/baby.model';

///////////////////////////////////////////////////////////////////////////////////

export class BabyMapper {

    static toDto = (baby: BabyModel): BabyDto => {
        if (!baby) {
            return null;
        }
        
        const dto: BabyDto = {
            id                 : baby.id,
            DeliveryId         : baby.DeliveryId,
            PatientUserId      : baby.PatientUserId,
            WeightAtBirthGrams : baby.WeightAtBirthGrams,
            Gender             : baby.Gender,
            Status             : baby.Status,
            ComplicationId     : baby.ComplicationId,
        };
        return dto;
    };

}
