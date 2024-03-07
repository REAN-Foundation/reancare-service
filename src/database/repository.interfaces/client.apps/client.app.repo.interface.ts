import { ClientAppSearchFilters, ClientAppSearchResults } from '../../../domain.types/client.apps/client.app.search.types';
import { ClientAppDomainModel } from '../../../domain.types/client.apps/client.app.domain.model';
import { ClientAppDto, ApiKeyDto } from '../../../domain.types/client.apps/client.app.dto';
import { CurrentClient } from '../../../domain.types/miscellaneous/current.client';

////////////////////////////////////////////////////////////////////////////////////////////////

export interface IClientAppRepo {

    create(clientDomainModel: ClientAppDomainModel): Promise<ClientAppDto>;

    getById(id: string): Promise<ClientAppDto>;

    getByCode(clientCode: string): Promise<ClientAppDto>;

    getClientHashedPassword(id: string): Promise<string>;

    getApiKey(id: string): Promise<ApiKeyDto>;

    setApiKey(id: string, apiKey: string, validFrom: Date, validTill: Date): Promise<ApiKeyDto>;

    isApiKeyValid(apiKey: string): Promise<CurrentClient>;

    update(id: string, clientDomainModel: ClientAppDomainModel): Promise<ClientAppDto>;

    search(filters: ClientAppSearchFilters): Promise<ClientAppSearchResults>;

    delete(id: string): Promise<boolean>;

}
