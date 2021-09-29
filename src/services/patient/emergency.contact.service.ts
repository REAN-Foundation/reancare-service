import { inject, injectable } from "tsyringe";
import { IEmergencyContactRepo } from "../../database/repository.interfaces/patient/emergency.contact.repo.interface";
import { EmergencyContactDomainModel } from '../../domain.types/patient/emergency.contact/emergency.contact.domain.model';
import { EmergencyContactDto } from '../../domain.types/patient/emergency.contact/emergency.contact.dto';
import { EmergencyContactSearchResults, EmergencyContactSearchFilters } from '../../domain.types/patient/emergency.contact/emergency.contact.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EmergencyContactService {

    constructor(
        @inject('IEmergencyContactRepo') private _contactRepo: IEmergencyContactRepo,
    ) {}

    create = async (contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto> => {
        return await this._contactRepo.create(contactDomainModel);
    };

    getById = async (id: string): Promise<EmergencyContactDto> => {
        return await this._contactRepo.getById(id);
    };

    search = async (filters: EmergencyContactSearchFilters): Promise<EmergencyContactSearchResults> => {
        return await this._contactRepo.search(filters);
    };

    update = async (id: string, contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto> => {
        return await this._contactRepo.update(id, contactDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._contactRepo.delete(id);
    };

}
