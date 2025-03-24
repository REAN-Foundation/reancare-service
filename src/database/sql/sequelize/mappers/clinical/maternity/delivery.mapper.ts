import { DeliveryDetailsDto, DeliveryDto } from '../../../../../../domain.types/clinical/maternity/delivery/delivery.dto';
import Delivery from '../../../models/clinical/maternity/delivery.model';
import { DeliveryMode, DeliveryOutcome } from '../../../../../../domain.types/clinical/maternity/delivery/delivery.type';

///////////////////////////////////////////////////////////////////////////////////

export class DeliveryMapper {

    static toDto = (delivery: Delivery): DeliveryDto => {
        if (delivery == null) {
            return null;
        }

        const dto: DeliveryDto = {
            id                  : delivery.id,
            PregnancyId         : delivery.PregnancyId,
            PatientUserId       : delivery.PatientUserId,
            DeliveryDate        : delivery.DeliveryDate,
            DeliveryTime        : delivery.DeliveryTime,
            GestationAtBirth    : delivery.GestationAtBirth,
            DeliveryMode        : delivery.DeliveryMode as DeliveryMode,
            DeliveryPlace       : delivery.DeliveryPlace,
            DeliveryOutcome     : delivery.DeliveryOutcome as DeliveryOutcome,
            DateOfDischarge     : delivery.DateOfDischarge,
            OverallDiagnosis    : delivery.OverallDiagnosis,
        };
        return dto;
    };
}
