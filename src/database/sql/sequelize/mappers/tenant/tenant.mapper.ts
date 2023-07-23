import Tenant from '../../models/tenant/tenant.model';
import { TenantDto } from '../../../../../domain.types/tenant/tenant.dto';

///////////////////////////////////////////////////////////////////////////////////

export class TenantMapper {

    static toDto = (tenant: Tenant): TenantDto => {
        if (tenant == null){
            return null;
        }
        const dto: TenantDto = {
            id          : tenant.id,
            Name        : tenant.Name,
            Description : tenant.Description,
            Code        : tenant.Code,
            Phone       : tenant.Phone,
            Email       : tenant.Email,
        };
        return dto;
    };

}
