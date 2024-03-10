import { ClientAppDto, ApiKeyDto } from '../../../../../domain.types/client.apps/client.app.dto';
import ClientApp from '../../models/client.apps/client.app.model';

///////////////////////////////////////////////////////////////////////////////////

export class ClientMapper {

    static toDto = (client: ClientApp): ClientAppDto => {
        if (client == null){
            return null;
        }
        let active = false;
        if (client.ValidFrom < new Date() && client.ValidTill > new Date()) {
            active = true;
        }
        const dto: ClientAppDto = {
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

    static toClientSecretsDto = (client: ClientApp): ApiKeyDto => {
        if (client == null){
            return null;
        }
        const dto: ApiKeyDto = {
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
