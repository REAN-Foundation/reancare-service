import 'reflect-metadata';
import { ILabOrganizationStore } from '../interfaces/lab.organization.store.interface';
import { injectable, inject } from "tsyringe";
import { OrganizationDomainModel } from '../../../domain.types/general/organization/organization.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class LabOrganizationStore {

    constructor(@inject('ILabOrganizationStore') private _service: ILabOrganizationStore) {}

    create = async (model: OrganizationDomainModel): Promise<any> => {
        return await this._service.create(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: OrganizationDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
