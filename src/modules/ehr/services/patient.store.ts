import { IPatientStore } from '../interfaces/patient.store.interface';
import { injectable, inject } from "tsyringe";
import { PatientDomainModel } from '../../../domain.types/users/patient/patient/patient.domain.model';
import { PatientSearchFilters } from '../../../domain.types/users/patient/patient/patient.search.types';

///////////////////////////////////////////////////////////////////

@injectable()
export class PatientStore {

    constructor(@inject('IPatientStore') private _service: IPatientStore) {}

    create = async (body: PatientDomainModel): Promise<any> => {
        return await this._service.create(body);
    };

    search = async (filter: PatientSearchFilters): Promise<any> => {
        return await this._service.search(filter);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: PatientDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
