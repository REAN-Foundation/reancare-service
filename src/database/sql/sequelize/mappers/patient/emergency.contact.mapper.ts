import EmergencyContact from '../../models/patient/emergency.contact.model';
import { EmergencyContactDto } from '../../../../../domain.types/patient/emergency.contact/emergency.contact.dto';
import { EmergencyContactRoles } from '../../../../../domain.types/patient/emergency.contact/emergency.contact.types';

///////////////////////////////////////////////////////////////////////////////////

export class EmergencyContactMapper {

    static toDto = (contact: EmergencyContact): EmergencyContactDto => {
        if (contact == null){
            return null;
        }

        const dto: EmergencyContactDto = {
            id                      : contact.id,
            PatientUserId           : contact.PatientUserId,
            ContactPerson           : undefined,
            ContactRelation         : contact.ContactRelation as EmergencyContactRoles,
            Address                 : undefined,
            Organization            : undefined,
            IsAvailableForEmergency : contact.IsAvailableForEmergency,
            TimeOfAvailability      : contact.TimeOfAvailability,
            Description             : contact.Description,
            AdditionalPhoneNumbers  : contact.AdditionalPhoneNumbers,
        };
        return dto;
    }

}
