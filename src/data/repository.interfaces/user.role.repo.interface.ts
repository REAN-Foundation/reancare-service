import { UserRoleDTO } from '../domain.types/role.domain.types';


export interface IUserRoleRepo {

    getUserRoles(userId: string): Promise<UserRoleDTO[]>;

    addUserRole(userId: string, roleId: number): Promise<UserRoleDTO>;

    removeUserRole(userId: string): Promise<boolean>;

    getUserCountByRoles(): Promise<any>;

}
