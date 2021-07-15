import { RolePrivilegeDto } from '../domain.types/role.domain.types';

export interface IRolePrivilegeRepo {

    create(entity: any): Promise<RolePrivilegeDto>;

    getById(id: string): Promise<RolePrivilegeDto>;

    search(): Promise<RolePrivilegeDto[]>;

    getPrivilegesForRole (roleId: number): Promise<RolePrivilegeDto[]>;

    delete(id: string): Promise<boolean>;

}
