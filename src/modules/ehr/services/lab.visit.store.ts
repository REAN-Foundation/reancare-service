import { injectable, inject } from "tsyringe";
import { ILabVisitStore } from '../interfaces/lab.visit.store.interface';
import { LabVisitDomainModel } from '../../../domain.types/clinical/lab.visit/lab.visit.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class LabVisitStore {

    constructor(@inject('ILabVisitStore') private _service: ILabVisitStore) {}

    create = async (body: LabVisitDomainModel): Promise<any> => {
        return await this._service.create(body);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: LabVisitDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
