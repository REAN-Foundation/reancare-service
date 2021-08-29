import { inject, injectable } from "tsyringe";
import { IOrganizationRepo } from "../database/repository.interfaces/organization.repo.interface";
import { OrganizationDomainModel } from '../domain.types/organization/organization.domain.model';
import { OrganizationDto } from '../domain.types/organization/organization.dto';
import { OrganizationSearchFilters, OrganizationSearchResults } from '../domain.types/organization/organization.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class OrganizationService {

    constructor(
        @inject('IOrganizationRepo') private _organizationRepo: IOrganizationRepo,
    ) {}

    create = async (organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto> => {
        return await this._organizationRepo.create(organizationDomainModel);
    };

    getById = async (id: string): Promise<OrganizationDto> => {
        return await this._organizationRepo.getById(id);
    };

    getByContactUserId = async (contactUserId: string): Promise<OrganizationDto[]> => {
        return await this._organizationRepo.getByContactUserId(contactUserId);
    };

    getByPersonId = async (personId: string): Promise<OrganizationDto[]> => {
        return await this._organizationRepo.getByPersonId(personId);
    };

    search = async (filters: OrganizationSearchFilters): Promise<OrganizationSearchResults> => {
        return await this._organizationRepo.search(filters);
    };

    update = async (id: string, organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto> => {
        return await this._organizationRepo.update(id, organizationDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._organizationRepo.delete(id);
    };

    addAddress = async (id: string, addressId: string): Promise<boolean> => {
        return await this._organizationRepo.addAddress(id, addressId);
    }

    removeAddress = async (id: string, addressId: string): Promise<boolean> => {
        return await this._organizationRepo.removeAddress(id, addressId);
    }

    addPerson = async (id: string, personId: string): Promise<boolean> => {
        return await this._organizationRepo.addPerson(id, personId);
    }

    removePerson = async (id: string, personId: string): Promise<boolean> => {
        return await this._organizationRepo.removePerson(id, personId);
    }

}
