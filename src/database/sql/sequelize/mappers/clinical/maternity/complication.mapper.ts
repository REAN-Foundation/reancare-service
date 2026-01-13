import { ComplicationDto } from '../../../../../../domain.types/clinical/maternity/complication/complication.dto';
import ComplicationModel from '../../../models/clinical/maternity/complication.model';

///////////////////////////////////////////////////////////////////////////////////

export class ComplicationMapper {

    static toDto = (complication: ComplicationModel): ComplicationDto => {
        if (complication == null) {
            return null;
        }
        
        const dto: ComplicationDto = {
            id                : complication.id,
            DeliveryId        : complication.DeliveryId,
            BabyId1           : complication.BabyId1,
            BabyId2           : complication.BabyId2,
            BabyId3           : complication.BabyId3,
            Name              : complication.Name,
            Status            : complication.Status,
            Severity          : complication.Severity,
            MedicalConditionId: complication.MedicalConditionId,
        };
        return dto;
    };

}