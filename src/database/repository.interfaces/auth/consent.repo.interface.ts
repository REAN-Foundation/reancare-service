import {
    ConsentCreateModel,
    ConsentSearchFilters,
    ConsentSearchResults,
    ConsentDto,
    ConsentUpdateModel
} from '../../../domain.types/auth/consent.types';

////////////////////////////////////////////////////////////////////////////////////////////////

export interface IConsentRepo {

    create(model: ConsentCreateModel): Promise<ConsentDto>;

    getById(id: string): Promise<ConsentDto>;

    update(id: string, model: ConsentUpdateModel): Promise<ConsentDto>;

    search(filters: ConsentSearchFilters): Promise<ConsentSearchResults>;

    delete(id: string): Promise<boolean>;

}
