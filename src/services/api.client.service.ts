import { inject, injectable } from "tsyringe";
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { ApiClientDomainModel, ApiClientDto, ApiClientVerificationDomainModel, ClientApiKeyDto } from "../data/domain.types/api.client.domain.types";
import { IClientRepo } from "../data/repository.interfaces/client.repo.interface";
import { generate} from 'generate-password';
import { Helper } from "../common/helper";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ApiClientService {
    constructor(@inject('IClientRepo') private _clientRepo: IClientRepo) {}

    create = async (clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        var clientCode = await this.getClientCode(clientDomainModel.ClientName);
        clientDomainModel.ClientCode = clientCode;
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
        return await this._clientRepo.getApiKey(client.id);
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
        for(var i = 0; i < len; i++) {
            if(Helper.isAlpha(name.charAt(i))) {
                if(!Helper.isAlphaVowel(name.charAt(i))) {
                    cleanedName += name.charAt(i);
                }
            }
        }
        var postfix = this.getClientCodePostfix();
        var tmpCode = cleanedName + postfix;
        tmpCode = tmpCode.substring(0, 8);
        var existing = await this._clientRepo.getByClientCode(tmpCode);
        while(existing != null) {
            tmpCode = tmpCode.substring(0, 4);
            tmpCode += this.getClientCodePostfix();
            tmpCode = tmpCode.substring(0, 8);
            existing = await this._clientRepo.getByClientCode(tmpCode);
        }
        return tmpCode;
    }

    private getClientCodePostfix() {
        return generate({
            length: 8,
            numbers: false,
            lowercase: false,
            uppercase: true,
            symbols: false,
            exclude: ',-@#$%^&*()'
        });
    }
}
