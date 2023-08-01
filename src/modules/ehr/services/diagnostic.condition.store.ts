import 'reflect-metadata';
import { IDiagnosticConditionStore } from '../interfaces/diagnostic.condition.store.interface';
import { injectable, inject } from "tsyringe";
import { DiagnosticConditionDomainModel } from "../../../domain.types/clinical/diagnosis/diagnostic.condition.domain.model";

///////////////////////////////////////////////////////////////////

@injectable()
export class DiagnosticConditionStore {

    constructor(@inject('IDiagnosticConditionStore') private _service: IDiagnosticConditionStore) {}

    add = async (model: DiagnosticConditionDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: DiagnosticConditionDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
