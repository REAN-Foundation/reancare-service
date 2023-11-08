import { UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { UserDetailsDto } from '../../../../domain.types/users/user/user.dto';

////////////////////////////////////////////////////////////////////////////////////

export interface IUserRepo {

    getByEmailAndRole(email: any, roleId: number);

    getByPhoneAndRole(phone: string, roleId: number);

    create(userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getById(id: string): Promise<UserDetailsDto>;

    updateLastLogin(id: string): Promise<void>;

    delete(id: string): Promise<boolean>;

    getUserByPersonIdAndRole(personId: string, loginRoleId: number): Promise<UserDetailsDto>;

    userNameExists(userName: string): Promise<boolean>;

    userExistsWithUsername(userName: string): Promise<boolean>;

    userExistsWithPhone(phone: string): Promise<boolean>;

    getUserWithUserName(userName: string): Promise<UserDetailsDto>;

    update(id: string, userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getUserHashedPassword(id: string): Promise<string>;

    getAllRegisteredUsers(): Promise<any[]>;

}
