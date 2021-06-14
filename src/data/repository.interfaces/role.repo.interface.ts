import { RoleDTO } from '../domain.types/role.domain.types';

export interface IRoleRepo {

    create(entity: any): Promise<RoleDTO>;

    getById(id: number): Promise<RoleDTO>;

    delete(id: number): Promise<boolean>;

    search(name?: string): Promise<RoleDTO[]>;
}
