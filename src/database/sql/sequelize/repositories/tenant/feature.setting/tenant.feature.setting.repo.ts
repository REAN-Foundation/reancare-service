import TenantFeatureSetting from '../../../models/tenant/tenant.feature.setting.model';
import { ITenantFeatureSettingRepo } from '../../../../../../database/repository.interfaces/tenant/tenant.setting/tenant.feature.setting.interface';
import { TenantFeatuteSettingMapper } from '../../../mappers/tenant/feature.setting/tenant.feature.setting.mapper';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { TenantFeatureSettingDomainModel } from '../../../../../../domain.types/tenant/feature.setting/tenant.feature.setting.domain.model';
import { TenantFeatureSettingDto } from '../../../../../../domain.types/tenant/feature.setting/tenant.setting.feature.dto';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { TenantFeatureSettingSearchFilters, TenantFeatureSettingSearchResults } from '../../../../../../domain.types/tenant/feature.setting/tenant.feature.setting.search.type';

///////////////////////////////////////////////////////////////////////////////////

export class TenantFeatureSettingRepo implements ITenantFeatureSettingRepo {

    create = async (model: TenantFeatureSettingDomainModel): Promise<TenantFeatureSettingDto> => {
        try {
            const entity = {
                TenantId : model.TenantId,
                Setting  : JSON.stringify(model.Setting)
            };
            const tenantFeatureSetting = await TenantFeatureSetting.create(entity);
            return TenantFeatuteSettingMapper.toDto(tenantFeatureSetting);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to create tenant feature settings: ${error.message}`);
        }
    };

    getById = async (id: uuid): Promise<TenantFeatureSettingDto> => {
        try {
            const tenantFeatureSetting = await TenantFeatureSetting.findByPk(id);
            return TenantFeatuteSettingMapper.toDto(tenantFeatureSetting);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to get tenant feature settings: ${error.message}`);
        }
    };

    search = async (filters: TenantFeatureSettingSearchFilters): Promise<TenantFeatureSettingSearchResults> => {
        try {
            const search = { where: {} };
            if (filters.TenantId != null) {
                search.where['TenantId'] = filters.TenantId;
            }
           
            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
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

            const foundResults = await TenantFeatureSetting.findAndCountAll(search);

            const dtos: TenantFeatureSettingDto[] = foundResults.rows.map((tenant) => {
                return TenantFeatuteSettingMapper.toDto(tenant);
            });

            const searchResults: TenantFeatureSettingSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
        }
        catch (error) {
            throw new Error(`Failed to search tenants: ${error.message}`);
        }
    };

    update = async (id: uuid, model: TenantFeatureSettingDomainModel): Promise<TenantFeatureSettingDto> => {
        try {
            const tenantFeatureSetting = await TenantFeatureSetting.findByPk(id);

            if (model.Setting != null) {
                tenantFeatureSetting.Setting = JSON.stringify(model.Setting);
            }
            
            await tenantFeatureSetting.save();

            return TenantFeatuteSettingMapper.toDto(tenantFeatureSetting);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant feature settings: ${error.message}`);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const deletedCount = await TenantFeatureSetting.destroy({ where: { Id: id } });
            return deletedCount > 0;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to delete tenant feature settings: ${error.message}`);
        }
    };
    
}
