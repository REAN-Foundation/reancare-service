import EmergencyEvent from '../models/emergency.event.model';
import { EmergencyEventDto } from '../../../../domain.types/emergency.event/emergency.event.dto';

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
    }

}
