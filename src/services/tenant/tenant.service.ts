import { ITenantRepo } from '../../database/repository.interfaces/tenant/tenant.repo.interface';
import { injectable, inject } from 'tsyringe';
import { TenantDomainModel } from '../../domain.types/tenant/tenant.domain.model';
import { TenantDto } from '../../domain.types/tenant/tenant.dto';
import { TenantSearchFilters, TenantSearchResults } from '../../domain.types/tenant/tenant.search.types';

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

    public getById = async (id: string): Promise<TenantDto> => {
        return await this._tenantRepo.getById(id);
    };

    public exists = async (id: string): Promise<boolean> => {
        return await this._tenantRepo.exists(id);
    };

    public search = async (filters: TenantSearchFilters): Promise<TenantSearchResults> => {
        var dtos = await this._tenantRepo.search(filters);
        return dtos;
    };

    public update = async (id: string, model: TenantDomainModel): Promise<TenantDto> => {
        return await this._tenantRepo.update(id, model);
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._tenantRepo.delete(id);
    };

    getTenantWithPhone = async (phone: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithPhone(phone);
    };

    getTenantWithCode = async (code: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithCode(code);
    };

    getTenantWithEmail = async (email: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithEmail(email);
    };

    //#endregion

}
