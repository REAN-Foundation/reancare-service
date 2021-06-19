import { IClientRepo } from '../../../repository.interfaces/client.repo.interface';
import Client from '../models/client.model';
import { Op, Sequelize } from 'sequelize';
import { ClientDomainModel, ClientDto, ClientSecretsDto } from '../../../domain.types/client.domain.types';
import { ClientMapper } from '../mappers/client.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';

///////////////////////////////////////////////////////////////////////

export class ClientRepo implements IClientRepo {

    create = async (clientDomainModel: ClientDomainModel): Promise<ClientDto> => {
        try {
            var entity = {
                ClientName: clientDomainModel.ClientName,
                ClientCode: clientDomainModel.ClientCode,
                Phone: clientDomainModel.Phone,
                Email: clientDomainModel.Email,
                Password: clientDomainModel.Password ?? null,
                APIKey: clientDomainModel.APIKey ?? null,
                ValidFrom: clientDomainModel.ValidFrom ?? null,
                ValidTo: clientDomainModel.ValidTo ?? null,
            };
            var client = await Client.create(entity);
            var dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ClientDto> => {
        try {
            var client = await Client.findByPk(id);
            var dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getSecrets = async(id: string): Promise<ClientSecretsDto> => {
        try {
            var client = await Client.findByPk(id);
            var dto = await ClientMapper.toClientSecretsDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }
    
    update = async (id: string, clientDomainModel: ClientDomainModel): Promise<ClientDto> => {
        try {
            var client = await Client.findByPk(id);

            if(clientDomainModel.ClientName != null) {
                client.ClientName = clientDomainModel.ClientName;
            }
            if(clientDomainModel.ClientCode != null) {
                client.ClientCode = clientDomainModel.ClientCode;
            }
            if(clientDomainModel.Password != null) {
                client.Password = clientDomainModel.Password;
            }
            if(clientDomainModel.Phone != null) {
                client.Phone = clientDomainModel.Phone;
            }
            if(clientDomainModel.Email != null) {
                client.Email = clientDomainModel.Email;
            }
            if(clientDomainModel.APIKey != null) {
                client.APIKey = clientDomainModel.APIKey;
            }
            if(clientDomainModel.ValidFrom != null) {
                client.ValidFrom = clientDomainModel.ValidFrom;
            }
            if(clientDomainModel.ValidTo != null) {
                client.ValidTo = clientDomainModel.ValidTo;
            }
            await client.save();

            var dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    delete = async (id: string): Promise<boolean> => {
        try {
            var client = await Client.findOne({ where: { id: id, IsActive: true } });
            client.IsActive = false;
            await client.save();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
