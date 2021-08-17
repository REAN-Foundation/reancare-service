import { PersonRoleDto } from '../../domain.types/role.domain.types';

export interface IPersonRoleRepo {

    getPersonRoles(userId: string): Promise<PersonRoleDto[]>;

    addPersonRole(userId: string, roleId: number): Promise<PersonRoleDto>;

    removePersonRole(userId: string): Promise<boolean>;

    getPersonCountByRoles(): Promise<any>;

}
