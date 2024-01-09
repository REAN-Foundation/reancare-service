import { ITenantFeatureSettingRepo } from '../../../database/repository.interfaces/tenant/tenant.setting/tenant.feature.setting.interface';
import { injectable, inject } from 'tsyringe';
import { TenantFeatureSettingDomainModel } from '../../../domain.types/tenant/feature.setting/tenant.feature.setting.domain.model';
import { TenantFeatureSettingDto } from '../../../domain.types/tenant/feature.setting/tenant.setting.feature.dto';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { TenantFeatureSettingSearchFilters, TenantFeatureSettingSearchResults } from '../../../domain.types/tenant/feature.setting/tenant.feature.setting.search.type';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantFeatureSettingService {

    constructor(
        @inject('ITenantFeatureSettingRepo') private _tenantFeatureSettingRepo: ITenantFeatureSettingRepo,
    ) {}

    //#region Publics

    create = async (model: TenantFeatureSettingDomainModel): Promise<TenantFeatureSettingDto> => {
        return await this._tenantFeatureSettingRepo.create(model);
    };

    public getById = async (id: uuid): Promise<TenantFeatureSettingDto> => {
        return await this._tenantFeatureSettingRepo.getById(id);
    };

    public search = async (filters: TenantFeatureSettingSearchFilters): Promise<TenantFeatureSettingSearchResults> => {
        var dtos = await this._tenantFeatureSettingRepo.search(filters);
        return dtos;
    };

    public update = async (id: uuid, model: TenantFeatureSettingDomainModel): Promise<TenantFeatureSettingDto> => {
        return await this._tenantFeatureSettingRepo.update(id, model);
    };

    public delete = async (id: uuid): Promise<boolean> => {
        return await this._tenantFeatureSettingRepo.delete(id);
    };

    //#endregion

}
