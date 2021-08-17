import { UserDetailsDto, UserDomainModel } from '../../domain.types/user.domain.types';

export interface IUserRepo {

    create(userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getById(id: string): Promise<UserDetailsDto>;

    getUserByPersonIdAndRole(personId: string, loginRoleId: number): Promise<UserDetailsDto>;

    userNameExists(userName: string): Promise<boolean>;

    userExistsWithUsername(userName: string): Promise<boolean>;

    userExistsWithPhone(phone: string): Promise<boolean>;

    getUserWithUserName(userName: string): Promise<UserDetailsDto>;

    update(id: string, userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getUserHashedPassword(id: string): Promise<string>;
}
