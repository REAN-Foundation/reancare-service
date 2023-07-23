
import { TenantDomainModel } from "../../../domain.types/tenant/tenant.domain.model";
import { TenantDto } from "../../../domain.types/tenant/tenant.dto";
import { TenantSearchFilters,
    TenantSearchResults
} from "../../../domain.types/tenant/tenant.search.types";

export interface ITenantRepo {

    create(model: TenantDomainModel): Promise<TenantDto>;

    getById(id: string): Promise<TenantDto>;

    getTenantWithPhone(phone: string): Promise<TenantDto>;

    getTenantWithEmail(email: string): Promise<TenantDto>;

    getTenantWithCode(code: string): Promise<TenantDto>;

    exists(id: string): Promise<boolean>;

    search(filters: TenantSearchFilters): Promise<TenantSearchResults>;

    update(id: string, model: TenantDomainModel): Promise<TenantDto>;

    delete(id: string): Promise<boolean>;

}
