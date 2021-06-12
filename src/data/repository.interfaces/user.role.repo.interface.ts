import { UserRoleDTO } from '../dtos/user.role.dto';


export interface IUserRoleRepo {

    getUserRoles(userId: string): Promise<UserRoleDTO[]>;

    addUserRole(userId: string, role: number): Promise<boolean>;

    removeUserRole(userId: string, role: number): Promise<boolean>;
    
    getUserCountByRoles(): Promise<any>;

}
