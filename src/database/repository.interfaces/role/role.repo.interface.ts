import { RoleDomainModel } from '../../../domain.types/role/role.domain.model';
import { RoleDto } from '../../../domain.types/role/role.dto';

export interface IRoleRepo {

    create(roleDomainModel: RoleDomainModel): Promise<RoleDto>;

    getById(id: number): Promise<RoleDto>;

    getByName(name: string): Promise<RoleDto>;

    delete(id: number): Promise<boolean>;

    search(name?: string): Promise<RoleDto[]>;

    update(id: number, roleDomainModel: RoleDomainModel): Promise<RoleDto>;

}
