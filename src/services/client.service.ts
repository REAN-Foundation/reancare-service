import { inject, injectable } from "tsyringe";
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { ApiClientDomainModel, ApiClientDto, ClientApiKeyDto } from "../data/domain.types/api.client.domain.types";
import { IClientRepo } from "../data/repository.interfaces/client.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ClientService {

    constructor(
        @inject('IClientRepo') private _clientRepo: IClientRepo,
    ) {}

    create = async (clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        return await this._clientRepo.create(clientDomainModel);
    };

    getById = async (id: string): Promise<ApiClientDto> => {
        return await this._clientRepo.getById(id);
    };

    getSecrets = async (id: string): Promise<ClientApiKeyDto> => {
        return await this._clientRepo.getSecrets(id);
    };

    update = async (id: string, clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        return await this._clientRepo.update(id, clientDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._clientRepo.delete(id);
    };
}
