import { IClientAppRepo } from '../../../../repository.interfaces/client.apps/client.app.repo.interface';
import ClientApp from '../../models/client.apps/client.app.model';
import { Op } from 'sequelize';
import { ClientAppDomainModel } from '../../../../../domain.types/client.apps/client.app.domain.model';
import { ClientMapper } from '../../mappers/client.apps/client.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { CurrentClient } from '../../../../../domain.types/miscellaneous/current.client';
import { ClientAppDto, ApiKeyDto } from '../../../../../domain.types/client.apps/client.app.dto';
import { ClientAppSearchFilters, ClientAppSearchResults } from '../../../../../domain.types/client.apps/client.app.search.types';

///////////////////////////////////////////////////////////////////////

export class ClientAppRepo implements IClientAppRepo {

    create = async (model: ClientAppDomainModel): Promise<ClientAppDto> => {
        try {
            const entity = {
                ClientName   : model.ClientName,
                ClientCode   : model.ClientCode,
                IsPrivileged : model.IsPrivileged,
                Phone        : model.Phone,
                Email        : model.Email,
                Password     : model.Password ?? null,
                ApiKey       : model.ApiKey ?? null,
                ValidFrom    : model.ValidFrom ?? null,
                ValidTill    : model.ValidTill ?? null,
            };
            const client = await ClientApp.create(entity);
            const dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ClientAppDto> => {
        try {
            const client = await ClientApp.findByPk(id);
            const dto = await ClientMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: ClientAppSearchFilters): Promise<ClientAppSearchResults> => {
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

            const foundResults = await ClientApp.findAndCountAll(search);

            const dtos: ClientAppDto[] = [];
            for (const apiclient of foundResults.rows) {
                const dto = await ClientMapper.toDto(apiclient);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: ClientAppSearchResults = {
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

    getByCode = async (clientCode: string): Promise<ClientAppDto> =>{
        try {
            const client = await ClientApp.findOne({
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
            const client = await ClientApp.findByPk(id);
            return client.Password;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getApiKey = async(id: string): Promise<ApiKeyDto> => {
        try {
            const client = await ClientApp.findByPk(id);
            const dto = await ClientMapper.toClientSecretsDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    setApiKey = async(id: string, apiKey: string, validFrom: Date, validTill: Date): Promise<ApiKeyDto> => {
        try {
            const client = await ClientApp.findByPk(id);
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

            const client = await ClientApp.findOne({
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

    update = async (id: string, model: ClientAppDomainModel): Promise<ClientAppDto> => {
        try {
            const client = await ClientApp.findByPk(id);

            //Client code is not modifiable
            //Use renew key to update ApiKey, ValidFrom and ValidTill

            if (model.ClientName != null) {
                client.ClientName = model.ClientName;
            }
            if (model.Password != null) {
                client.Password = model.Password;
            }
            if (model.Phone != null) {
                client.Phone = model.Phone;
            }
            if (model.Email != null) {
                client.Email = model.Email;
            }
            if (model.ValidTill != null) {
                client.ValidTill = model.ValidTill;
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
            const result = await ClientApp.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
