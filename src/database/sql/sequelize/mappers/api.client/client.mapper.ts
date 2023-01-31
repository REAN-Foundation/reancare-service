import { ApiClientDto, ClientApiKeyDto } from '../../../../../domain.types/api.client/api.client.dto';
import ApiClient from '../../models/api.client/api.client.model';

///////////////////////////////////////////////////////////////////////////////////

export class ClientMapper {

    static toDto = (client: ApiClient): ApiClientDto => {
        if (client == null){
            return null;
        }
        let active = false;
        if (client.ValidFrom < new Date() && client.ValidTill > new Date()) {
            active = true;
        }
        const dto: ApiClientDto = {
            id           : client.id,
            ClientName   : client.ClientName,
            ClientCode   : client.ClientCode,
            IsPrivileged : client.IsPrivileged,
            Phone        : client.Phone,
            Email        : client.Email,
            IsActive     : active
        };
        return dto;
    };

    static toClientSecretsDto = (client: ApiClient): ClientApiKeyDto => {
        if (client == null){
            return null;
        }
        const dto: ClientApiKeyDto = {
            id         : client.id,
            ClientName : client.ClientName,
            ClientCode : client.ClientCode,
            ApiKey     : client.ApiKey,
            ValidFrom  : client.ValidFrom,
            ValidTill  : client.ValidTill,
        };
        return dto;
    };

}
