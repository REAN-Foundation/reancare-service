import { EmergencyContactDomainModel } from "../../../../domain.types/users/patient/emergency.contact/emergency.contact.domain.model";
import { EmergencyContactDto } from "../../../../domain.types/users/patient/emergency.contact/emergency.contact.dto";
import { EmergencyContactSearchFilters, EmergencyContactSearchResults } from "../../../../domain.types/users/patient/emergency.contact/emergency.contact.search.types";

export interface IEmergencyContactRepo {

    create(contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto>;

    getById(id: string): Promise<EmergencyContactDto>;

    checkIfContactPersonExists(patientUserId: string, contactPersonId: string) : Promise<boolean>;

    getContactsCountWithRole(patientUserId: string, contactRole: string) : Promise<number>;

    search(filters: EmergencyContactSearchFilters): Promise<EmergencyContactSearchResults>;

    update(id: string, contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto>;

    delete(id: string): Promise<boolean>;

}
