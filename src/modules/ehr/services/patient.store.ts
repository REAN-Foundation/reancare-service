/// <reference path = "../types/patient.types.ts" />
/// <reference path = "../interfaces/patient.store.interface.ts" />  

import { IPatientStore } from '../interfaces/patient.store.interface';
import { injectable, inject } from "tsyringe";
///////////////////////////////////////////////////////////////////

@injectable()
export class PatientStore {

    constructor(@inject('IPatientStore') private _service: IPatientStore) {}

    create = async (body: any): Promise<any> => {
        return await this._service.create(body);
    }

    search = async (filter: any): Promise<any> => {
        return await this._service.create(filter);
    }

    getById = async (id: string): Promise<any> => {
        return await this._service.create(id);
    }

    update = async (updates: any): Promise<any> => {
        return await this._service.create(updates);
    }

    delete = async (id: string): Promise<any> => {
        return await this._service.create(id);
    }

}

