import { IClientRepo } from '../../../repository.interfaces/client.repo.interface';
import ApiClient from '../models/api.client.model';
import { Op, Sequelize } from 'sequelize';
import { ApiClientDomainModel, ApiClientDto, ClientApiKeyDto } from '../../../domain.types/api.client.domain.types';
import { ClientMapper } from '../mappers/client.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';

///////////////////////////////////////////////////////////////////////

export class ApiClientRepo implements IClientRepo {

    create = async (clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        try {
            var entity = {
                ClientName: clientDomainModel.ClientName,
                ClientCode: clientDomainModel.ClientCode,
                Phone: clientDomainModel.Phone,
                Email: clientDomainModel.Email,
                Password: clientDomainModel.Password ?? null,
                ApiKey: clientDomainModel.ApiKey ?? null,
                ValidFrom: clientDomainModel.ValidFrom ?? null,
                ValidTo: clientDomainModel.ValidTo ?? null,
            };
            var client = await ApiClient.create(entity);
            var dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ApiClientDto> => {
        try {
            var client = await ApiClient.findByPk(id);
            var dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByClientCode = async (clientCode: string): Promise<ApiClientDto> =>{
        try {
            var client = await ApiClient.findOne({
                where:{
                    ClientCode: clientCode
                }
            });
            var dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getApiKey = async(id: string): Promise<ClientApiKeyDto> => {
        try {
            var client = await ApiClient.findByPk(id);
            var dto = await ClientMapper.toClientSecretsDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }
    
    update = async (id: string, clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        try {
            var client = await ApiClient.findByPk(id);

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
            if(clientDomainModel.ApiKey != null) {
                client.ApiKey = clientDomainModel.ApiKey;
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
            var client = await ApiClient.findOne({ where: { id: id, IsActive: true } });
            client.IsActive = false;
            await client.save();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
