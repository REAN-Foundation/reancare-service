
import { TenantDomainModel } from "../../../domain.types/tenant/tenant.domain.model";
import { TenantDto } from "../../../domain.types/tenant/tenant.dto";
import { TenantSearchFilters,
    TenantSearchResults
} from "../../../domain.types/tenant/tenant.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

///////////////////////////////////////////////////////////////////////////////////

export interface ITenantRepo {

    create(model: TenantDomainModel): Promise<TenantDto>;

    getById(id: uuid): Promise<TenantDto>;

    getTenantWithPhone(phone: string): Promise<TenantDto>;

    getTenantWithEmail(email: string): Promise<TenantDto>;

    getTenantWithCode(code: string): Promise<TenantDto>;

    exists(id: uuid): Promise<boolean>;

    search(filters: TenantSearchFilters): Promise<TenantSearchResults>;

    tenantCount(): Promise<number>;

    update(id: uuid, model: TenantDomainModel): Promise<TenantDto>;

    delete(id: uuid, hardDelete?: boolean): Promise<boolean>;

    promoteTenantUserAsAdmin(id: uuid, userId: uuid): Promise<boolean>;

    demoteAdmin(id: uuid, userId: uuid): Promise<boolean>;

    getTenantStats(id: uuid): Promise<any>;

    getTenantAdmins(id: uuid): Promise<any[]>;

    getTenantRegularUsers(id: uuid): Promise<any[]>;

    getActiveTenants(): Promise<TenantDto[]>;

}
