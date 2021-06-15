import { RoleDto } from '../domain.types/role.domain.types';

export interface IRoleRepo {

    create(entity: any): Promise<RoleDto>;

    getById(id: number): Promise<RoleDto>;

    delete(id: number): Promise<boolean>;

    search(name?: string): Promise<RoleDto[]>;
}
