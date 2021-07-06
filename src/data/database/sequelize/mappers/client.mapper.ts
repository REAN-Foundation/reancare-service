import ApiClient from '../models/api.client.model';
import { ApiClientDto, ClientApiKeyDto, ApiClientDomainModel } from "../../../domain.types/api.client.domain.types";

///////////////////////////////////////////////////////////////////////////////////

export class ClientMapper {

    static toDto = (client: ApiClient): ApiClientDto => {
        if(client == null){
            return null;
        }
        var dto: ApiClientDto = {
            id: client.id,
            ClientName: client.ClientName,
            ClientCode: client.ClientCode,
            Phone: client.Phone,
            Email: client.Email,
            IsActive: client.IsActive
        };
        return dto;
    }

    static toClientSecretsDto = (client: ApiClient): ClientApiKeyDto => {
        if(client == null){
            return null;
        }
        var dto: ClientApiKeyDto = {
            id: client.id,
            ClientName: client.ClientName,
            ClientCode: client.ClientCode,
            ApiKey: client.ApiKey,
            ValidFrom: client.ValidFrom,
            ValidTill: client.ValidTill,
        };
        return dto;
    }

}

