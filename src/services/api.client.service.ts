import { inject, injectable } from "tsyringe";
import { ApiError } from '../common/api.error';
import { ApiClientDomainModel, ApiClientDto, ApiClientVerificationDomainModel, ClientApiKeyDto } from "../data/domain.types/api.client.domain.types";
import { IApiClientRepo } from "../data/repository.interfaces/api.client.repo.interface";
import { generate} from 'generate-password';
import { Helper } from "../common/helper";
import { CurrentClient } from "../data/domain.types/current.client";
const uuidAPIKey = require('uuid-apikey');
////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ApiClientService {
    constructor(@inject('IApiClientRepo') private _clientRepo: IApiClientRepo) {}

    create = async (clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        var clientCode = await this.getClientCode(clientDomainModel.ClientName);
        clientDomainModel.ClientCode = clientDomainModel.ClientCode ?? clientCode;
        var key = uuidAPIKey.create();
        clientDomainModel.ApiKey = clientDomainModel.ApiKey?? key.apiKey;

        var d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        clientDomainModel.ValidFrom =  clientDomainModel.ValidFrom ?? new Date();
        clientDomainModel.ValidTill = clientDomainModel.ValidTill ?? d

        return await this._clientRepo.create(clientDomainModel);
    };

    createInternalClients = async (clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        var clientCode = await this.getClientCode(clientDomainModel.ClientName);
        clientDomainModel.ClientCode = clientCode;
        var key = uuidAPIKey.create();
        clientDomainModel.ApiKey = key.apiKey;
        return await this._clientRepo.create(clientDomainModel);
    };

    getById = async (id: string): Promise<ApiClientDto> => {
        return await this._clientRepo.getById(id);
    };

    getByClientCode = async (clientCode: string): Promise<ApiClientDto> => {
        return await this._clientRepo.getByClientCode(clientCode);
    };

    getApiKey = async (verificationModel: ApiClientVerificationDomainModel): Promise<ClientApiKeyDto> => {
        var client = await this._clientRepo.getByClientCode(verificationModel.ClientCode);
        if (client == null) {
            let message = 'Client does not exist with code (' + verificationModel.ClientCode + ')';
            throw new ApiError(404, message);
        }
        var hashedPassword = await this._clientRepo.getClientHashedPassword(client.id);
        var isPasswordValid = Helper.compare(verificationModel.Password, hashedPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password!');
        }
        return await this._clientRepo.getApiKey(client.id);
    };

    renewApiKey = async (verificationModel: ApiClientVerificationDomainModel): Promise<ClientApiKeyDto> => {

        var client = await this._clientRepo.getByClientCode(verificationModel.ClientCode);
        if (client == null) {
            let message = 'Client does not exist for client code (' + verificationModel.ClientCode + ')';
            throw new ApiError(404, message);
        }

        var hashedPassword = await this._clientRepo.getClientHashedPassword(client.id);
        var isPasswordValid = Helper.compare(verificationModel.Password, hashedPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password!');
        }

        var key = uuidAPIKey.create();
        var clientApiKeyDto = await this._clientRepo.setApiKey(
            client.id,
            key.apiKey,
            verificationModel.ValidFrom,
            verificationModel.ValidTill
        );
        
        return clientApiKeyDto;
    };

    isApiKeyValid = async (apiKey: string): Promise<CurrentClient> => {
        return await this._clientRepo.isApiKeyValid(apiKey);
    };

    update = async (id: string, clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        return await this._clientRepo.update(id, clientDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._clientRepo.delete(id);
    };

    private getClientCode = async (clientName: string) => {
        var name = clientName;
        name = name.toUpperCase();
        var cleanedName = '';
        var len = name.length;
        for (var i = 0; i < len; i++) {
            if (Helper.isAlpha(name.charAt(i))) {
                if (!Helper.isAlphaVowel(name.charAt(i))) {
                    cleanedName += name.charAt(i);
                }
            }
        }
        var postfix = this.getClientCodePostfix();
        var tmpCode = cleanedName + postfix;
        tmpCode = tmpCode.substring(0, 8);
        var existing = await this._clientRepo.getByClientCode(tmpCode);
        while (existing != null) {
            tmpCode = tmpCode.substring(0, 4);
            tmpCode += this.getClientCodePostfix();
            tmpCode = tmpCode.substring(0, 8);
            existing = await this._clientRepo.getByClientCode(tmpCode);
        }
        return tmpCode;
    };

    private getClientCodePostfix() {
        return generate({
            length: 8,
            numbers: false,
            lowercase: false,
            uppercase: true,
            symbols: false,
            exclude: ',-@#$%^&*()',
        });
    }
}
