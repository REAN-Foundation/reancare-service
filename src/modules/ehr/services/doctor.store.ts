import { IDoctorStore } from '../interfaces/doctor.store.interface';
import { injectable, inject } from "tsyringe";
import { DoctorDomainModel } from '../../../domain.types/users/doctor/doctor.domain.model';
import { DoctorSearchFilters } from '../../../domain.types/users/doctor/doctor.search.types';

///////////////////////////////////////////////////////////////////

@injectable()
export class DoctorStore {

    constructor(@inject('IDoctorStore') private _service: IDoctorStore) {}

    create = async (body: DoctorDomainModel): Promise<any> => {
        return await this._service.create(body);
    };

    search = async (filter: DoctorSearchFilters): Promise<any> => {
        return await this._service.search(filter);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: DoctorDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
