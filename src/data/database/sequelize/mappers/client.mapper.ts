import { Client } from '../models/client.model';
import { ClientDto, ClientSecretsDto, ClientDomainModel } from "../../../domain.types/client.domain.types";

///////////////////////////////////////////////////////////////////////////////////

export class ClientMapper {

    static toDto = (client: Client): ClientDto => {
        if(client == null){
            return null;
        }
        var dto: ClientDto = {
            id: client.id,
            ClientName: client.ClientName,
            ClientCode: client.ClientCode,
            Phone: client.Phone,
            Email: client.Email,
            IsActive: client.IsActive
        };
        return dto;
    }

    static toClientSecretsDto = (client: Client): ClientSecretsDto => {
        if(client == null){
            return null;
        }
        var dto: ClientSecretsDto = {
            id: client.id,
            ClientName: client.ClientName,
            ClientCode: client.ClientCode,
            APIKey: client.APIKey,
            ValidFrom: client.ValidFrom,
            ValidTo: client.ValidTo,
        };
        return dto;
    }

}

