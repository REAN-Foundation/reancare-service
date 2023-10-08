import { inject, injectable } from "tsyringe";
import {
    ConsentCreateModel,
    ConsentDto,
    ConsentSearchFilters,
    ConsentSearchResults,
    ConsentUpdateModel
} from "../../domain.types/auth/consent.types";
import { IConsentRepo } from "../../database/repository.interfaces/auth/consent.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ConsentService {

    constructor(@inject('IConsentRepo') private _consentRepo: IConsentRepo) {}

    create = async (model: ConsentCreateModel): Promise<ConsentDto> => {
        return await this._consentRepo.create(model);
    };

    getById = async (id: string): Promise<ConsentDto> => {
        return await this._consentRepo.getById(id);
    };

    update = async (id: string, model: ConsentUpdateModel): Promise<ConsentDto> => {
        return await this._consentRepo.update(id, model);
    };

    public search = async (filters: ConsentSearchFilters): Promise<ConsentSearchResults> => {
        return await this._consentRepo.search(filters);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._consentRepo.delete(id);
    };

}
