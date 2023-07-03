import 'reflect-metadata';
import { IImagingStudyStore } from '../interfaces/imaging.study.store.interface';
import { injectable, inject } from "tsyringe";
import { ImagingStudyDomainModel } from '../../../domain.types/clinical/imaging.study/imaging.study.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class ImagingStudyStore {

    constructor(@inject('IImagingStudyStore') private _service: IImagingStudyStore) {}

    create = async (model: ImagingStudyDomainModel): Promise<any> => {
        return await this._service.create(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: ImagingStudyDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
