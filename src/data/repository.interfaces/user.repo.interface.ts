import { UserDto, UserDtoLight } from '../domain.types/user.domain.types';


export interface IUserRepo {

    create(entity: any): Promise<UserDto>;

    getById(id: string): Promise<UserDto>;

    delete(id: string): Promise<boolean>;

    userExistsWithPhone(phone: string): Promise<boolean>;

    getUserWithPhone(phone: string): Promise<UserDto>;

    userExistsWithEmail(email: string): Promise<boolean>;

    getUserWithEmail(email: string): Promise<UserDto>;

    userExistsWithUsername(userName: string): Promise<boolean>;

    searchLight(filters: any): Promise<UserDtoLight[]>;

    searchFull(filters: any): Promise<UserDto[]>;

    getUserHashedPassword(id: string): Promise<string>;
}
