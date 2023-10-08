import { inject, injectable } from "tsyringe";
import { ApiError } from '../../common/api.error';
import { ClientAppDomainModel, ClientAppVerificationDomainModel } from "../../domain.types/client.apps/client.app.domain.model";
import { ClientAppDto, ApiKeyDto } from "../../domain.types/client.apps/client.app.dto";
import { IClientAppRepo } from "../../database/repository.interfaces/client.apps/client.app.repo.interface";
import { generate } from 'generate-password';
import { Helper } from "../../common/helper";
import { CurrentClient } from "../../domain.types/miscellaneous/current.client";
import * as apikeyGenerator from 'uuid-apikey';
import { ClientAppSearchFilters, ClientAppSearchResults } from "../../domain.types/client.apps/client.app.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ClientAppService {

    constructor(@inject('IClientAppRepo') private _clientAppRepo: IClientAppRepo) {}

    create = async (model: ClientAppDomainModel): Promise<ClientAppDto> => {
        const clientCode = await this.getClientCode(model.ClientName);
        model.ClientCode = model.ClientCode ?? clientCode;
        const key = apikeyGenerator.default.create();
        model.ApiKey = model.ApiKey ?? key.apiKey;

        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        model.ValidFrom = model.ValidFrom ?? new Date();
        model.ValidTill = model.ValidTill ?? d;

        return await this._clientAppRepo.create(model);
    };

    createInternalClients = async (model: ClientAppDomainModel): Promise<ClientAppDto> => {
        const clientCode = await this.getClientCode(model.ClientName);
        model.ClientCode = clientCode;
        const key = apikeyGenerator.default.create();
        model.ApiKey = key.apiKey;
        return await this._clientAppRepo.create(model);
    };

    getById = async (id: string): Promise<ClientAppDto> => {
        return await this._clientAppRepo.getById(id);
    };

    getByCode = async (clientCode: string): Promise<ClientAppDto> => {
        return await this._clientAppRepo.getByCode(clientCode);
    };

    getApiKey = async (verificationModel: ClientAppVerificationDomainModel): Promise<ApiKeyDto> => {
        const client = await this._clientAppRepo.getByCode(verificationModel.ClientCode);
        if (client == null) {
            const message = 'Client does not exist with code (' + verificationModel.ClientCode + ')';
            throw new ApiError(404, message);
        }
        const hashedPassword = await this._clientAppRepo.getClientHashedPassword(client.id);
        const isPasswordValid = Helper.compare(verificationModel.Password, hashedPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password!');
        }
        return await this._clientAppRepo.getApiKey(client.id);
    };

    renewApiKey = async (model: ClientAppVerificationDomainModel): Promise<ApiKeyDto> => {

        const client = await this._clientAppRepo.getByCode(model.ClientCode);
        if (client == null) {
            const message = 'Client does not exist for client code (' + model.ClientCode + ')';
            throw new ApiError(404, message);
        }

        const hashedPassword = await this._clientAppRepo.getClientHashedPassword(client.id);
        const isPasswordValid = Helper.compare(model.Password, hashedPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password!');
        }

        const key = apikeyGenerator.default.create();
        const clientApiKeyDto = await this._clientAppRepo.setApiKey(
            client.id,
            key.apiKey,
            model.ValidFrom,
            model.ValidTill
        );

        return clientApiKeyDto;
    };

    isApiKeyValid = async (apiKey: string): Promise<CurrentClient> => {
        return await this._clientAppRepo.isApiKeyValid(apiKey);
    };

    update = async (id: string, clientDomainModel: ClientAppDomainModel): Promise<ClientAppDto> => {
        return await this._clientAppRepo.update(id, clientDomainModel);
    };

    public search = async (filters: ClientAppSearchFilters): Promise<ClientAppSearchResults> => {
        return await this._clientAppRepo.search(filters);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._clientAppRepo.delete(id);
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
        let existing = await this._clientAppRepo.getByCode(tmpCode);
        while (existing != null) {
            tmpCode = tmpCode.substring(0, 4);
            tmpCode += this.getClientCodePostfix();
            tmpCode = tmpCode.substring(0, 8);
            existing = await this._clientAppRepo.getByCode(tmpCode);
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
