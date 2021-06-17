import { UserDetailsDto, UserDomainModel, UserDto } from '../domain.types/user.domain.types';


export interface IUserRepo {

    create(entity: any): Promise<UserDetailsDto>;

    getById(id: string): Promise<UserDetailsDto>;

    exists(id: string): Promise<boolean>;

    delete(id: string): Promise<boolean>;

    userExistsWithPhone(phone: string): Promise<boolean>;

    getUserWithPhone(phone: string): Promise<UserDetailsDto>;

    getAllUsersWithPhoneAndRole(phone: string, roleId: number): Promise<UserDetailsDto[]>;

    userExistsWithEmail(email: string): Promise<boolean>;

    getUserWithEmail(email: string): Promise<UserDetailsDto>;

    userExistsWithUsername(userName: string): Promise<boolean>;

    searchLight(filters: any): Promise<UserDto[]>;

    searchFull(filters: any): Promise<UserDetailsDto[]>;

    update(id: string, userDomainModel: UserDomainModel): Promise<UserDetailsDto>;

    getUserHashedPassword(id: string): Promise<string>;
}
