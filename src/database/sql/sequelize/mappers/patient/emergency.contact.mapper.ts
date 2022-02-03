import { EmergencyContactDto } from '../../../../../domain.types/patient/emergency.contact/emergency.contact.dto';
import { EmergencyContactRoles } from '../../../../../domain.types/patient/emergency.contact/emergency.contact.types';
import EmergencyContact from '../../models/patient/emergency.contact.model';
import { AddressMapper } from '../address.mapper';
import { OrganizationMapper } from '../organization.mapper';
import { PersonMapper } from '../person.mapper';

///////////////////////////////////////////////////////////////////////////////////

export class EmergencyContactMapper {

    static toDto = (contact: EmergencyContact): EmergencyContactDto => {
        if (contact == null){
            return null;
        }

        const dto: EmergencyContactDto = {
            id                      : contact.id,
            PatientUserId           : contact.PatientUserId,
            ContactPersonId         : contact.ContactPersonId,
            ContactPerson           : PersonMapper.toDto(contact.ContactPerson),
            ContactRelation         : contact.ContactRelation as EmergencyContactRoles,
            AddressId               : contact.AddressId,
            Address                 : AddressMapper.toDto(contact.Address),
            OrganizationId          : contact.OrganizationId,
            Organization            : OrganizationMapper.toDto(contact.Organization),
            IsAvailableForEmergency : contact.IsAvailableForEmergency,
            TimeOfAvailability      : contact.TimeOfAvailability,
            Description             : contact.Description,
            AdditionalPhoneNumbers  : contact.AdditionalPhoneNumbers,
        };
        return dto;
    };

}
