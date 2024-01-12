import { ITenantRepo } from '../../database/repository.interfaces/tenant/tenant.repo.interface';
import { injectable, inject } from 'tsyringe';
import { TenantDomainModel } from '../../domain.types/tenant/tenant.domain.model';
import { TenantDto } from '../../domain.types/tenant/tenant.dto';
import { TenantSearchFilters, TenantSearchResults } from '../../domain.types/tenant/tenant.search.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantService {

    constructor(
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
    ) {}

    //#region Publics

    create = async (model: TenantDomainModel): Promise<TenantDto> => {
        return await this._tenantRepo.create(model);
    };

    public getById = async (id: uuid): Promise<TenantDto> => {
        return await this._tenantRepo.getById(id);
    };

    public exists = async (id: uuid): Promise<boolean> => {
        return await this._tenantRepo.exists(id);
    };

    public search = async (filters: TenantSearchFilters): Promise<TenantSearchResults> => {
        var dtos = await this._tenantRepo.search(filters);
        return dtos;
    };

    public update = async (id: uuid, model: TenantDomainModel): Promise<TenantDto> => {
        return await this._tenantRepo.update(id, model);
    };

    public delete = async (id: uuid): Promise<boolean> => {
        return await this._tenantRepo.delete(id);
    };

    public getTenantWithPhone = async (phone: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithPhone(phone);
    };

    public getTenantWithCode = async (code: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithCode(code);
    };

    public getTenantWithEmail = async (email: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithEmail(email);
    };

    public promoteTenantUserAsAdmin = async (id: uuid, userId: uuid): Promise<boolean> => {
        return await this._tenantRepo.promoteTenantUserAsAdmin(id, userId);
    };

    public demoteAdmin = async (id: uuid, userId: uuid): Promise<boolean> => {
        return await this._tenantRepo.demoteAdmin(id, userId);
    };

    public getTenantStats = async (id: uuid): Promise<any> => {
        return await this._tenantRepo.getTenantStats(id);
    };

    public getTenantAdmins = async (id: uuid): Promise<any[]> => {
        return await this._tenantRepo.getTenantAdmins(id);
    };

    public getTenantRegularUsers = async (id: uuid): Promise<any[]> => {
        return await this._tenantRepo.getTenantRegularUsers(id);
    };

    public seedDefaultTenant = async (): Promise<TenantDto> => {
        var defaultTenant = await this._tenantRepo.getTenantWithCode('default');
        if (defaultTenant == null) {
            var tenant: TenantDomainModel = {
                Name        : 'default',
                Description : 'Default tenant',
                Code        : 'default',
                Phone       : '0000000000',
                Email       : 'support@reanfoundation.org',
            };
            var defaultTenant = await this._tenantRepo.create(tenant);
            return defaultTenant;
        }
        else {
            var defaultTenant = await this._tenantRepo.getTenantWithCode('default');
            return defaultTenant;
        }
    };

    //#endregion

}
