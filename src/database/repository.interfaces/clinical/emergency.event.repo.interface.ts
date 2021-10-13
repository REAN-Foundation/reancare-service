import { EmergencyEventDomainModel } from "../../../domain.types/clinical/emergency.event/emergency.event.domain.model";
import { EmergencyEventDto } from "../../../domain.types/clinical/emergency.event/emergency.event.dto";
import { EmergencyEventSearchFilters, EmergencyEventSearchResults } from "../../../domain.types/clinical/emergency.event/emergency.event.search.types";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IEmergencyEventRepo {

    create(addressDomainModel: EmergencyEventDomainModel): Promise<EmergencyEventDto>;

    getById(id: string): Promise<EmergencyEventDto>;

    search(filters: EmergencyEventSearchFilters): Promise<EmergencyEventSearchResults>;

    update(id: string, addressDomainModel: EmergencyEventDomainModel): Promise<EmergencyEventDto>;

    delete(id: string): Promise<boolean>;

}
