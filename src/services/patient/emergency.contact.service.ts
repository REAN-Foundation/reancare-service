import { inject, injectable } from "tsyringe";
import { IAddressRepo } from "../../database/repository.interfaces/address.repo.interface";
import { IOrganizationRepo } from "../../database/repository.interfaces/organization.repo.interface";
import { IEmergencyContactRepo } from "../../database/repository.interfaces/patient/emergency.contact.repo.interface";
import { IPersonRepo } from "../../database/repository.interfaces/person.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EmergencyContactDomainModel } from '../../domain.types/patient/emergency.contact/emergency.contact.domain.model';
import { EmergencyContactDto } from '../../domain.types/patient/emergency.contact/emergency.contact.dto';
import { EmergencyContactSearchFilters, EmergencyContactSearchResults } from '../../domain.types/patient/emergency.contact/emergency.contact.search.types';
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EmergencyContactService extends BaseResourceService {

    constructor(
        @inject('IEmergencyContactRepo') private _contactRepo: IEmergencyContactRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
        @inject('IOrganizationRepo') private _organizationRepo: IOrganizationRepo,
    ) {
        super();
    }

    create = async (contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto> => {
        var dto = await this._contactRepo.create(contactDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    getById = async (id: uuid): Promise<EmergencyContactDto> => {
        var dto = await this._contactRepo.getById(id);
        dto = await this.updateDto(dto);
        return dto;
    };

    checkIfContactPersonExists =  async (patientUserId: uuid, contactPersonId: string)
        : Promise<boolean> => {
        return await this._contactRepo.checkIfContactPersonExists(patientUserId, contactPersonId);
    }

    getContactsCountWithRole =  async (patientUserId: uuid, contactRole: string)
        : Promise<number> => {
        return await this._contactRepo.getContactsCountWithRole(patientUserId, contactRole);
    }

    search = async (filters: EmergencyContactSearchFilters): Promise<EmergencyContactSearchResults> => {
        var items = [];
        var results = await this._contactRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    update = async (id: uuid, contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto> => {
        var dto = await this._contactRepo.update(id, contactDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._contactRepo.delete(id);
    };

    //#region Privates

        private updateDto = async (dto: EmergencyContactDto): Promise<EmergencyContactDto> => {
            
            if (dto == null) {
                return null;
            }
            if (dto.ContactPersonId != null && dto.ContactPerson == null) {
                var contactPerson = await this._personRepo.getById(dto.ContactPersonId);
                dto.ContactPerson = contactPerson;
            }
    
            if (dto.OrganizationId !== null && dto.Organization === null) {
                var organization = await this._organizationRepo.getById(dto.OrganizationId);
                dto.Organization = organization;
            }
    
            if (dto.AddressId !== null && dto.Address === null) {
                var address = await this._addressRepo.getById(dto.AddressId);
                dto.Address = address;
            }
    
            return dto;
        };
    
    //#endregion

}
