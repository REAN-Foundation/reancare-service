import { injectable, inject } from "tsyringe";
import { ICarePlanStore } from '../interfaces/careplan.store.interface';
import { CarePlanEnrollmentDomainModel } from "../../../domain.types/clinical/careplan/enrollment/careplan.enrollment.domain.model";

///////////////////////////////////////////////////////////////////

@injectable()
export class CarePlanStore {

    constructor(@inject('ICarePlanStore') private _service: ICarePlanStore) {}

    add = async (body: CarePlanEnrollmentDomainModel): Promise<any> => {
        return await this._service.add(body);
    };

    search = async (filter): Promise<any> => {
        return await this._service.search(filter);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: CarePlanEnrollmentDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
