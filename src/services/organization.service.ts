import { inject, injectable } from "tsyringe";
import { OrganizationDomainModel, OrganizationDto, OrganizationSearchFilters, OrganizationSearchResults } from "../data/domain.types/organization.domain.types";
import { IOrganizationRepo } from "../data/repository.interfaces/organization.repo.interface";

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

    search = async (filters: OrganizationSearchFilters): Promise<OrganizationSearchResults> => {
        return await this._organizationRepo.search(filters);
    };

    update = async (id: string, organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto> => {
        return await this._organizationRepo.update(id, organizationDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._organizationRepo.delete(id);
    };

}
