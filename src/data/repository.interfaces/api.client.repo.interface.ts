import { ApiClientDomainModel, ApiClientDto, ClientApiKeyDto } from '../domain.types/api.client.domain.types';

export interface IApiClientRepo {

    create(clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto>;

    getById(id: string): Promise<ApiClientDto>;

    getByClientCode(clientCode: string): Promise<ApiClientDto>;

    getClientHashedPassword(id: string): Promise<string>;

    getApiKey(id: string): Promise<ClientApiKeyDto>;

    setApiKey(id: string, apiKey: string, validFrom: Date, validTill: Date): Promise<ClientApiKeyDto>;

    update(id: string, clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto>;

    delete(id: string): Promise<boolean>;

}
