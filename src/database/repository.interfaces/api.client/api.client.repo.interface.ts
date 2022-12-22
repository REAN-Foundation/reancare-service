import { ApiClientSearchFilters, ApiClientSearchResults } from '../../../domain.types/api.client/api.client.search.types';
import { ApiClientDomainModel } from '../../../domain.types/api.client/api.client.domain.model';
import { ApiClientDto, ClientApiKeyDto } from '../../../domain.types/api.client/api.client.dto';
import { CurrentClient } from '../../../domain.types/miscellaneous/current.client';

////////////////////////////////////////////////////////////////////////////////////////////////

export interface IApiClientRepo {

    create(clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto>;

    getById(id: string): Promise<ApiClientDto>;

    getByClientCode(clientCode: string): Promise<ApiClientDto>;

    getClientHashedPassword(id: string): Promise<string>;

    getApiKey(id: string): Promise<ClientApiKeyDto>;

    setApiKey(id: string, apiKey: string, validFrom: Date, validTill: Date): Promise<ClientApiKeyDto>;

    isApiKeyValid(apiKey: string): Promise<CurrentClient>;

    update(id: string, clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto>;

    search(filters: ApiClientSearchFilters): Promise<ApiClientSearchResults>;

    delete(id: string): Promise<boolean>;

}
