import 'reflect-metadata';
import { IDoctorVisitStore } from '../interfaces/doctor.visit.store.interface';
import { injectable, inject } from "tsyringe";
import { DoctorVisitDomainModel } from '../../../domain.types/clinical/doctor.visit/doctor.visit.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class DoctorVisitStore {

    constructor(@inject('IDoctorVisitStore') private _service: IDoctorVisitStore) {}

    create = async (model: DoctorVisitDomainModel): Promise<any> => {
        return await this._service.create(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: DoctorVisitDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
