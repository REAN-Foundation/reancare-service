import { UserRoleDTO } from '../dtos/user.role.dto';


export interface IUserRoleRepo {

    getUserRoles(userId: string): Promise<UserRoleDTO[]>;

    addUserRole(userId: string, roleId: number): Promise<UserRoleDTO>;

    removeUserRole(userId: string): Promise<boolean>;

    getUserCountByRoles(): Promise<any>;

}
