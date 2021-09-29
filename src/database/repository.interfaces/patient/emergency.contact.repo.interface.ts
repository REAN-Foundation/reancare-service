import { EmergencyContactDomainModel } from "../../../domain.types/patient/emergency.contact/emergency.contact.domain.model";
import { EmergencyContactDto } from "../../../domain.types/patient/emergency.contact/emergency.contact.dto";
import { EmergencyContactSearchFilters, EmergencyContactSearchResults } from "../../../domain.types/patient/emergency.contact/emergency.contact.search.types";

export interface IEmergencyContactRepo {

    create(contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto>;

    getById(id: string): Promise<EmergencyContactDto>;

    search(filters: EmergencyContactSearchFilters): Promise<EmergencyContactSearchResults>;

    update(id: string, contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto>;

    delete(id: string): Promise<boolean>;

}
