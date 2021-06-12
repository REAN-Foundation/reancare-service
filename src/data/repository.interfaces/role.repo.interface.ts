import { RoleDTO } from '../dtos/role.dto';

export interface IRoleRepo {

    create(entity: any): Promise<RoleDTO>;

    getById(id: number): Promise<RoleDTO>;

    delete(id: number): Promise<boolean>;

    search(name?: string): Promise<RoleDTO[]>;
}
