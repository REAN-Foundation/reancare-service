import { EmergencyEventDto } from '../../../../../domain.types/clinical/emergency.event/emergency.event.dto';
import EmergencyEvent from '../../models/clinical/emergency.event.model';

///////////////////////////////////////////////////////////////////////////////////

export class EmergencyEventMapper {

    static toDto = (emergencyEvent: EmergencyEvent): EmergencyEventDto => {
        if (emergencyEvent == null) {
            return null;
        }

        const dto: EmergencyEventDto = {
            id            : emergencyEvent.id,
            EhrId         : emergencyEvent.EhrId,
            PatientUserId : null,
            Details       : emergencyEvent.Details,
            EmergencyDate : emergencyEvent.EmergencyDate
        };
        return dto;
    };

}
