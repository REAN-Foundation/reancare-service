import { PersonRoleDto } from '../domain.types/role.domain.types';


export interface IPersonRoleRepo {

    getUserRoles(userId: string): Promise<PersonRoleDto[]>;

    addUserRole(userId: string, roleId: number): Promise<PersonRoleDto>;

    removeUserRole(userId: string): Promise<boolean>;

    getUserCountByRoles(): Promise<any>;

}
