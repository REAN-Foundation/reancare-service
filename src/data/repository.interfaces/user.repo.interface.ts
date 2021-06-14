import { UserDTO, UserDTOLight } from '../domain.types/user.domain.types';


export interface IUserRepo {

    create(entity: any): Promise<UserDTO>;

    getById(id: string): Promise<UserDTO>;

    delete(id: string): Promise<boolean>;

    userExistsWithPhone(phone: string): Promise<boolean>;

    getUserWithPhone(phone: string): Promise<UserDTO>;

    userExistsWithEmail(email: string): Promise<boolean>;

    getUserWithEmail(email: string): Promise<UserDTO>;

    userExistsWithUsername(userName: string): Promise<boolean>;

    searchLight(filters: any): Promise<UserDTOLight[]>;

    searchFull(filters: any): Promise<UserDTO[]>;

    getUserHashedPassword(id: string): Promise<string>;
}
