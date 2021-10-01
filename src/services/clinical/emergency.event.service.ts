import { inject, injectable } from "tsyringe";
import { IEmergencyEventRepo } from "../../database/repository.interfaces/clinical/emergency.event.repo.interface";
import { EmergencyEventDomainModel } from '../../domain.types/clinical/emergency.event/emergency.event.domain.model';
import { EmergencyEventDto } from '../../domain.types/clinical/emergency.event/emergency.event.dto';
import { EmergencyEventSearchFilters, EmergencyEventSearchResults } from '../../domain.types/clinical/emergency.event/emergency.event.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EmergencyEventService {

    constructor(
        @inject('IEmergencyEventRepo') private _emergencyEventRepo: IEmergencyEventRepo,
    ) {}

    create = async (emergencyEventDomainModel: EmergencyEventDomainModel): Promise<EmergencyEventDto> => {
        return await this._emergencyEventRepo.create(emergencyEventDomainModel);
    };

    getById = async (id: string): Promise<EmergencyEventDto> => {
        return await this._emergencyEventRepo.getById(id);
    };

    search = async (filters: EmergencyEventSearchFilters): Promise<EmergencyEventSearchResults> => {
        return await this._emergencyEventRepo.search(filters);
    };

    update = async (id: string, emergencyEventDomainModel: EmergencyEventDomainModel): Promise<EmergencyEventDto> => {
        return await this._emergencyEventRepo.update(id, emergencyEventDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._emergencyEventRepo.delete(id);
    };

}
