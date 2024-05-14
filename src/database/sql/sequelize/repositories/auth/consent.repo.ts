import { IConsentRepo } from '../../../../repository.interfaces/auth/consent.repo.interface';
import Consent from '../../models/auth/consent.model';
import { Op } from 'sequelize';
import { ConsentCreateModel, ConsentUpdateModel } from '../../../../../domain.types/auth/consent.types';
import { ConsentMapper } from '../../mappers/auth/consent.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { ConsentDto } from '../../../../../domain.types/auth/consent.types';
import { ConsentSearchFilters, ConsentSearchResults } from '../../../../../domain.types/auth/consent.types';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////

export class ConsentRepo implements IConsentRepo {

    create = async (model: ConsentCreateModel): Promise<ConsentDto> => {
        try {
            const entity = {
                ResourceId             : model.ResourceId,
                ResourceCategory       : model.ResourceCategory,
                ResourceName           : model.ResourceName,
                TenantId               : model.TenantId,
                OwnerUserId            : model.OwnerUserId,
                ConsentHolderUserId    : model.ConsentHolderUserId,
                AllResourcesInCategory : model.AllResourcesInCategory,
                TenantOwnedResource    : model.TenantOwnedResource,
                Perpetual              : model.Perpetual,
                Revoked                : model.Revoked,
                RevokedTimestamp       : model.RevokedTimestamp,
                ConsentGivenOn         : model.ConsentGivenOn,
                ConsentValidFrom       : model.ConsentValidFrom,
                ConsentValidTill       : model.ConsentValidTill,
            };
            const client = await Consent.create(entity);
            const dto = await ConsentMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ConsentDto> => {
        try {
            const client = await Consent.findByPk(id);
            const dto = await ConsentMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: ConsentSearchFilters): Promise<ConsentSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.TenantId != null) {
                search.where['TenantId'] = filters.TenantId;
            }
            if (filters.ResourceCategory != null) {
                search.where['ResourceCategory'] = filters.ResourceCategory;
            }
            if (filters.ResourceName != null) {
                search.where['ResourceName'] = { [Op.like]: '%' + filters.ResourceName + '%' };
            }
            if (filters.OwnerUserId != null) {
                search.where['OwnerUserId'] = filters.OwnerUserId;
            }
            if (filters.ConsentHolderUserId != null) {
                search.where['ConsentHolderUserId'] = filters.ConsentHolderUserId;
            }
            if (filters.AllResourcesInCategory != null) {
                search.where['AllResourcesInCategory'] = filters.AllResourcesInCategory;
            }
            if (filters.TenantOwnedResource != null) {
                search.where['TenantOwnedResource'] = filters.TenantOwnedResource;
            }
            if (filters.Perpetual != null) {
                search.where['Perpetual'] = filters.Perpetual;
            }
            if (filters.Revoked != null) {
                search.where['Revoked'] = filters.Revoked;
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

            const foundResults = await Consent.findAndCountAll(search);

            const dtos: ConsentDto[] = [];
            for (const apiclient of foundResults.rows) {
                const dto = await ConsentMapper.toDto(apiclient);
                dtos.push(dto);
            }

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: ConsentSearchResults = {
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

    getByCode = async (clientCode: string): Promise<ConsentDto> =>{
        try {
            const client = await Consent.findOne({
                where : {
                    ClientCode : clientCode
                }
            });
            const dto = await ConsentMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, model: ConsentUpdateModel): Promise<ConsentDto> => {
        try {
            const client = await Consent.findByPk(id);

            if (model.AllResourcesInCategory != null) {
                client.AllResourcesInCategory = model.AllResourcesInCategory;
            }
            if (model.TenantOwnedResource != null) {
                client.TenantOwnedResource = model.TenantOwnedResource;
            }
            if (model.Perpetual != null) {
                client.Perpetual = model.Perpetual;
            }

            await client.save();

            const dto = await ConsentMapper.toDto(client);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await Consent.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getActiveConsents = async (consenterId: uuid, consenteeId: uuid, context: string): Promise<ConsentDto[]> => {
        try {
            const consents = await Consent.findAll({
                where : {
                    OwnerUserId         : consenterId,
                    ConsentHolderUserId : consenteeId,
                    Revoked             : false,
                    ResourceName        : context,
                    [Op.or]             : [
                        {
                            ConsentValidFrom : { [Op.lte]: new Date() },
                            ConsentValidTill : { [Op.gte]: new Date() },
                        },
                        {
                            Perpetual : true
                        }
                    ]
                }
            });
            const dtos: ConsentDto[] = [];
            for (const consent of consents) {
                const dto = await ConsentMapper.toDto(consent);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
