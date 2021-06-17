import { inject, injectable } from "tsyringe";
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { ClientDomainModel, ClientDto, ClientSecretsDto } from "../data/domain.types/client.domain.types";
import { IClientRepo } from "../data/repository.interfaces/client.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ClientService {

    constructor(
        @inject('IClientRepo') private _clientRepo: IClientRepo,
    ) {}

    create = async (clientDomainModel: ClientDomainModel): Promise<ClientDto> => {
        return await this._clientRepo.create(clientDomainModel);
    };

    getById = async (id: string): Promise<ClientDto> => {
        return await this._clientRepo.getById(id);
    };

    getSecrets = async (id: string): Promise<ClientSecretsDto> => {
        return await this._clientRepo.getSecrets(id);
    };

    update = async (id: string, clientDomainModel: ClientDomainModel): Promise<ClientDto> => {
        return await this._clientRepo.update(id, clientDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._clientRepo.delete(id);
    };
}
