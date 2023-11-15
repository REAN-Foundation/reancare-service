import { uuid } from '../../../domain.types/miscellaneous/system.types';
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

    getById(id: uuid): Promise<ConsentDto>;

    update(id: uuid, model: ConsentUpdateModel): Promise<ConsentDto>;

    search(filters: ConsentSearchFilters): Promise<ConsentSearchResults>;

    delete(id: uuid): Promise<boolean>;

    getActiveConsents(consenterId: uuid, consenteeId: uuid, context: string): Promise<ConsentDto[]>;

}
