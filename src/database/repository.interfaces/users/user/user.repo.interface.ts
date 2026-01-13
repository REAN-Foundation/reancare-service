import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { UserDetailsDto } from '../../../../domain.types/users/user/user.dto';
import { TenantDto } from '../../../../domain.types/tenant/tenant.dto';
import { UserSearchFilters, UserSearchResults } from '../../../../domain.types/users/user/user.search.types';
import { MostRecentActivityDto } from '../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto';

////////////////////////////////////////////////////////////////////////////////////

export interface IUserRepo {

    getByEmailAndRole(email: any, roleId: number);

    getByPhoneAndRole(phone: string, roleId: number);

    getByUniqueReferenceIdAndRole(uniqueReferenceId: string, roleId: number): Promise<UserDetailsDto>;

    create(userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getById(id: uuid): Promise<UserDetailsDto>;

    getByUserName(userName: string): Promise<UserDetailsDto>;

    getByPersonId(personId: uuid): Promise<UserDetailsDto[]>;

    updateLastLogin(id: uuid): Promise<void>;

    search(filters: UserSearchFilters): Promise<UserSearchResults>;

    delete(id: uuid): Promise<boolean>;

    getUserByPersonIdAndRole(personId: uuid, loginRoleId: number): Promise<UserDetailsDto>;

    getUserByTenantIdAndRole(tenantId: uuid, roleName: string): Promise<UserDetailsDto>;

    userNameExists(userName: string): Promise<boolean>;

    userExistsWithUsername(userName: string): Promise<boolean>;

    userExistsWithPhone(phone: string): Promise<boolean>;

    getUserWithUserName(userName: string): Promise<UserDetailsDto>;

    update(id: uuid, userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getUserHashedPassword(id: uuid): Promise<string>;

    updateUserHashedPassword(id: uuid, hashedPassword: string): Promise<void>;

    checkUsersWithoutTenants(): Promise<void>;

    isTenantUser(userId: uuid, tenantId: uuid): Promise<boolean>;

    getTenantsForUser(userId: uuid): Promise<TenantDto[]>;

    getAllRegisteredUsers(): Promise<any[]>;

    getRecentUserActivity(): Promise<MostRecentActivityDto[]>;

}
