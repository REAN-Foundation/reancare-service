import { IBiometricsHeightStore } from '../interfaces/biometrics.height.store.interface';
import { injectable, inject } from "tsyringe";
import { BodyHeightDomainModel } from '../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class BiometricsHeightStore {

    constructor(@inject('IBiometricsHeightStore') private _service: IBiometricsHeightStore) {}

    add = async (model: BodyHeightDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: BodyHeightDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}
