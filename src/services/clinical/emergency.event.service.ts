import { inject, injectable } from "tsyringe";
import { IEmergencyEventRepo } from "../../database/repository.interfaces/clinical/emergency.event.repo.interface";
import { EmergencyEventDomainModel } from '../../domain.types/clinical/emergency.event/emergency.event.domain.model';
import { EmergencyEventDto } from '../../domain.types/clinical/emergency.event/emergency.event.dto';
import { EmergencyEventSearchFilters, EmergencyEventSearchResults } from '../../domain.types/clinical/emergency.event/emergency.event.search.types';
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EmergencyEventService extends BaseResourceService {

    constructor(
        @inject('IEmergencyEventRepo') private _emergencyEventRepo: IEmergencyEventRepo,
    ) {
        super();
    }

    create = async (emergencyEventDomainModel: EmergencyEventDomainModel): Promise<EmergencyEventDto> => {
        return await this._emergencyEventRepo.create(emergencyEventDomainModel);
    };

    getById = async (id: uuid): Promise<EmergencyEventDto> => {
        return await this._emergencyEventRepo.getById(id);
    };

    search = async (filters: EmergencyEventSearchFilters): Promise<EmergencyEventSearchResults> => {
        return await this._emergencyEventRepo.search(filters);
    };

    update = async (id: uuid, emergencyEventDomainModel: EmergencyEventDomainModel): Promise<EmergencyEventDto> => {
        return await this._emergencyEventRepo.update(id, emergencyEventDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._emergencyEventRepo.delete(id);
    };

}
