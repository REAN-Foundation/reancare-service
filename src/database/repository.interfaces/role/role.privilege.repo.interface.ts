import { RolePrivilegeDto } from "../../../domain.types/role/role.privilege.dto";

export interface IRolePrivilegeRepo {

    create(entity: any): Promise<RolePrivilegeDto>;

    getById(id: string): Promise<RolePrivilegeDto>;

    search(): Promise<RolePrivilegeDto[]>;

    getPrivilegesForRole (roleId: number): Promise<RolePrivilegeDto[]>;

    hasPrivilegeForRole (roleId: number, privilege: string): Promise<boolean>;

    delete(id: string): Promise<boolean>;

}
