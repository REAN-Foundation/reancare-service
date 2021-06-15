import { UserRoleDto } from '../domain.types/role.domain.types';


export interface IUserRoleRepo {

    getUserRoles(userId: string): Promise<UserRoleDto[]>;

    addUserRole(userId: string, roleId: number): Promise<UserRoleDto>;

    removeUserRole(userId: string): Promise<boolean>;

    getUserCountByRoles(): Promise<any>;

}
