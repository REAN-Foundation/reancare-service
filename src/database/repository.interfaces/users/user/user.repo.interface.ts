import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { UserDetailsDto } from '../../../../domain.types/users/user/user.dto';
import { TenantDto } from '../../../../domain.types/tenant/tenant.dto';

////////////////////////////////////////////////////////////////////////////////////

export interface IUserRepo {

    getByEmailAndRole(email: any, roleId: number);

    getByPhoneAndRole(phone: string, roleId: number);

    create(userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getById(id: uuid): Promise<UserDetailsDto>;

    getByPersonId(personId: uuid): Promise<UserDetailsDto>;

    updateLastLogin(id: uuid): Promise<void>;

    delete(id: uuid): Promise<boolean>;

    getUserByPersonIdAndRole(personId: uuid, loginRoleId: number): Promise<UserDetailsDto>;

    userNameExists(userName: string): Promise<boolean>;

    userExistsWithUsername(userName: string): Promise<boolean>;

    userExistsWithPhone(phone: string): Promise<boolean>;

    getUserWithUserName(userName: string): Promise<UserDetailsDto>;

    update(id: uuid, userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getUserHashedPassword(id: uuid): Promise<string>;

    checkUsersWithoutTenants(): Promise<void>;

    isTenantUser(userId: uuid, tenantId: uuid): Promise<boolean>;

    getTenantsForUser(userId: uuid): Promise<TenantDto[]>;

    getUserHashedPassword(id: string): Promise<string>;

    getAllRegisteredUsers(): Promise<any[]>;

}
