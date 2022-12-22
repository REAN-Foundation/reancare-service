import { IApiClientRepo } from '../../../../repository.interfaces/api.client/api.client.repo.interface';
import ApiClient from '../../models/api.client/api.client.model';
import { Op } from 'sequelize';
import { ApiClientDomainModel } from '../../../../../domain.types/api.client/api.client.domain.model';
import { ClientMapper } from '../../mappers/api.client/client.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { CurrentClient } from '../../../../../domain.types/miscellaneous/current.client';
import { ApiClientDto, ClientApiKeyDto } from '../../../../../domain.types/api.client/api.client.dto';
import { ApiClientSearchFilters, ApiClientSearchResults } from '../../../../../domain.types/api.client/api.client.search.types';

///////////////////////////////////////////////////////////////////////

export class ApiClientRepo implements IApiClientRepo {

    create = async (clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        try {
            const entity = {
                ClientName   : clientDomainModel.ClientName,
                ClientCode   : clientDomainModel.ClientCode,
                IsPrivileged : clientDomainModel.IsPrivileged,
                Phone        : clientDomainModel.Phone,
                Email        : clientDomainModel.Email,
                Password     : clientDomainModel.Password ?? null,
                ApiKey       : clientDomainModel.ApiKey ?? null,
                ValidFrom    : clientDomainModel.ValidFrom ?? null,
                ValidTill    : clientDomainModel.ValidTill ?? null,
            };
            const client = await ApiClient.create(entity);
            const dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ApiClientDto> => {
        try {
            const client = await ApiClient.findByPk(id);
            const dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: ApiClientSearchFilters): Promise<ApiClientSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.ClientCode != null) {
                search.where['ClientCode'] = filters.ClientCode;
            }
            if (filters.ClientName != null) {
                search.where['ClientName'] = filters.ClientName;
            }
            if (filters.Phone != null) {
                search.where['Phone'] = { [Op.like]: '%' + filters.Phone + '%' };
            }
            if (filters.Email != null) {
                search.where['Email'] = filters.Email;
            }
            if (filters.ValidFrom != null) {
                search.where['ValidFrom'] = filters.ValidFrom;
            }
            if (filters.ValidTill != null) {
                search.where['ValidTill'] = filters.ValidTill;
            }

            const orderByColum = 'CreatedAt';
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await ApiClient.findAndCountAll(search);

            const dtos: ApiClientDto[] = [];
            for (const apiclient of foundResults.rows) {
                const dto = await ClientMapper.toDto(apiclient);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: ApiClientSearchResults = {
                TotalCount     : totalCount,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos
            };

            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByClientCode = async (clientCode: string): Promise<ApiClientDto> =>{
        try {
            const client = await ApiClient.findOne({
                where : {
                    ClientCode : clientCode
                }
            });
            const dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getClientHashedPassword = async(id: string): Promise<string> => {
        try {
            const client = await ApiClient.findByPk(id);
            return client.Password;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getApiKey = async(id: string): Promise<ClientApiKeyDto> => {
        try {
            const client = await ApiClient.findByPk(id);
            const dto = await ClientMapper.toClientSecretsDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    setApiKey = async(id: string, apiKey: string, validFrom: Date, validTill: Date): Promise<ClientApiKeyDto> => {
        try {
            const client = await ApiClient.findByPk(id);
            client.ApiKey = apiKey;
            client.ValidFrom = validFrom;
            client.ValidTill = validTill;
            await client.save();
            const dto = await ClientMapper.toClientSecretsDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    isApiKeyValid = async (apiKey: string): Promise<CurrentClient> => {
        try {

            const client = await ApiClient.findOne({
                where : {
                    ApiKey    : apiKey,
                    ValidFrom : { [Op.lte]: new Date() },
                    ValidTill : { [Op.gte]: new Date() }
                }
            });
            if (client == null){
                return null;
            }
            const currentClient: CurrentClient = {
                ClientName   : client.ClientName,
                ClientCode   : client.ClientCode,
                IsPrivileged : client.IsPrivileged
            };
            return currentClient;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto> => {
        try {
            const client = await ApiClient.findByPk(id);

            //Client code is not modifiable
            //Use renew key to update ApiKey, ValidFrom and ValidTill

            if (clientDomainModel.ClientName != null) {
                client.ClientName = clientDomainModel.ClientName;
            }
            if (clientDomainModel.Password != null) {
                client.Password = clientDomainModel.Password;
            }
            if (clientDomainModel.Phone != null) {
                client.Phone = clientDomainModel.Phone;
            }
            if (clientDomainModel.Email != null) {
                client.Email = clientDomainModel.Email;
            }
            if (clientDomainModel.ValidTill != null) {
                client.ValidTill = clientDomainModel.ValidTill;
            }
            await client.save();

            const dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await ApiClient.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
