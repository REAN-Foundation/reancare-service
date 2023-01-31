import { inject, injectable } from "tsyringe";
import { ApiError } from '../../common/api.error';
import { ApiClientDomainModel, ApiClientVerificationDomainModel } from "../../domain.types/api.client/api.client.domain.model";
import { ApiClientDto, ClientApiKeyDto } from "../../domain.types/api.client/api.client.dto";
import { IApiClientRepo } from "../../database/repository.interfaces/api.client/api.client.repo.interface";
import { generate } from 'generate-password';
import { Helper } from "../../common/helper";
import { CurrentClient } from "../../domain.types/miscellaneous/current.client";
import * as apikeyGenerator from 'uuid-apikey';
import { ApiClientSearchFilters, ApiClientSearchResults } from "../../domain.types/api.client/api.client.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ApiClientService {

    constructor(@inject('IApiClientRepo') private _clientRepo: IApiClientRepo) {}

    create = async (clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        const clientCode = await this.getClientCode(clientDomainModel.ClientName);
        clientDomainModel.ClientCode = clientDomainModel.ClientCode ?? clientCode;
        const key = apikeyGenerator.default.create();
        clientDomainModel.ApiKey = clientDomainModel.ApiKey ?? key.apiKey;

        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        clientDomainModel.ValidFrom = clientDomainModel.ValidFrom ?? new Date();
        clientDomainModel.ValidTill = clientDomainModel.ValidTill ?? d;

        return await this._clientRepo.create(clientDomainModel);
    };

    createInternalClients = async (clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        const clientCode = await this.getClientCode(clientDomainModel.ClientName);
        clientDomainModel.ClientCode = clientCode;
        const key = apikeyGenerator.default.create();
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
        const client = await this._clientRepo.getByClientCode(verificationModel.ClientCode);
        if (client == null) {
            const message = 'Client does not exist with code (' + verificationModel.ClientCode + ')';
            throw new ApiError(404, message);
        }
        const hashedPassword = await this._clientRepo.getClientHashedPassword(client.id);
        const isPasswordValid = Helper.compare(verificationModel.Password, hashedPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password!');
        }
        return await this._clientRepo.getApiKey(client.id);
    };

    renewApiKey = async (verificationModel: ApiClientVerificationDomainModel): Promise<ClientApiKeyDto> => {

        const client = await this._clientRepo.getByClientCode(verificationModel.ClientCode);
        if (client == null) {
            const message = 'Client does not exist for client code (' + verificationModel.ClientCode + ')';
            throw new ApiError(404, message);
        }

        const hashedPassword = await this._clientRepo.getClientHashedPassword(client.id);
        const isPasswordValid = Helper.compare(verificationModel.Password, hashedPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password!');
        }

        const key = apikeyGenerator.default.create();
        const clientApiKeyDto = await this._clientRepo.setApiKey(
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

    public search = async (filters: ApiClientSearchFilters): Promise<ApiClientSearchResults> => {
        return await this._clientRepo.search(filters);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._clientRepo.delete(id);
    };

    private getClientCode = async (clientName: string) => {
        let name = clientName;
        name = name.toUpperCase();
        let cleanedName = '';
        const len = name.length;
        for (let i = 0; i < len; i++) {
            if (Helper.isAlpha(name.charAt(i))) {
                if (!Helper.isAlphaVowel(name.charAt(i))) {
                    cleanedName += name.charAt(i);
                }
            }
        }
        const postfix = this.getClientCodePostfix();
        let tmpCode = cleanedName + postfix;
        tmpCode = tmpCode.substring(0, 8);
        let existing = await this._clientRepo.getByClientCode(tmpCode);
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
            length    : 8,
            numbers   : false,
            lowercase : false,
            uppercase : true,
            symbols   : false,
            exclude   : ',-@#$%^&*()',
        });
    }

}
