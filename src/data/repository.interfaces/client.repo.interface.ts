import { ClientDomainModel, ClientDto, ClientSecretsDto } from '../domain.types/client.domain.types';

export interface IClientRepo {

    create(clientDomainModel: ClientDomainModel): Promise<ClientDto>;

    getById(id: string): Promise<ClientDto>;

    getSecrets(id: string): Promise<ClientSecretsDto>;

    update(id: string, clientDomainModel: ClientDomainModel): Promise<ClientDto>;

    delete(id: string): Promise<boolean>;

}
