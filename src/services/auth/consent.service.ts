import { inject, injectable } from "tsyringe";
import {
    ConsentCreateModel,
    ConsentDto,
    ConsentSearchFilters,
    ConsentSearchResults,
    ConsentUpdateModel
} from "../../domain.types/auth/consent.types";
import { IConsentRepo } from "../../database/repository.interfaces/auth/consent.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ConsentService {

    constructor(@inject('IConsentRepo') private _consentRepo: IConsentRepo) {}

    public create = async (model: ConsentCreateModel): Promise<ConsentDto> => {
        return await this._consentRepo.create(model);
    };

    public getById = async (id: string): Promise<ConsentDto> => {
        return await this._consentRepo.getById(id);
    };

    public update = async (id: string, model: ConsentUpdateModel): Promise<ConsentDto> => {
        return await this._consentRepo.update(id, model);
    };

    public search = async (filters: ConsentSearchFilters): Promise<ConsentSearchResults> => {
        return await this._consentRepo.search(filters);
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._consentRepo.delete(id);
    };

    public getActiveConsents = async (consenterId: uuid, consenteeId: uuid, context: string): Promise<ConsentDto[]> => {
        return await this._consentRepo.getActiveConsents(consenterId, consenteeId, context);
    };

}
