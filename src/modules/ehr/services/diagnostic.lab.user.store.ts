import 'reflect-metadata';
import { IDiagnosticLabUserStore } from '../interfaces/diagnostic.lab.user.store.interface';
import { injectable, inject } from "tsyringe";
import { DiagnosticLabUserDomainModel } from '../../../domain.types/users/diagnostic.lab.user/diagnostic.lab.user.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class DiagnosticLabUserStore {

    constructor(@inject('IDiagnosticLabUserStore') private _service: IDiagnosticLabUserStore) {}

    create = async (model: DiagnosticLabUserDomainModel): Promise<any> => {
        return await this._service.create(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: DiagnosticLabUserDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
