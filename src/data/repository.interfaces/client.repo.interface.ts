import { ApiClientDomainModel, ApiClientDto, ClientApiKeyDto } from '../domain.types/api.client.domain.types';

export interface IClientRepo {

    create(clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto>;

    getById(id: string): Promise<ApiClientDto>;

    getByClientCode(clientCode: string): Promise<ApiClientDto>;

    getApiKey(id: string): Promise<ClientApiKeyDto>;

    update(id: string, clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto>;

    delete(id: string): Promise<boolean>;

}
