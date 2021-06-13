import { UserDTO, UserDTOLight } from '../dtos/user.dto';


export interface IUserRepo {

    create(entity: any): Promise<UserDTO>;

    getById(id: string): Promise<UserDTO>;

    delete(id: string): Promise<boolean>;

    userExistsWithPhone(phone: string): Promise<boolean>;

    getUserWithPhone(phone: string): Promise<UserDTO>;

    userExistsWithEmail(email: string): Promise<boolean>;

    getUserWithEmail(email: string): Promise<UserDTO>;

    searchLight(filters: any): Promise<UserDTOLight[]>;

    searchFull(filters: any): Promise<UserDTO[]>;

    getUserHashedPassword(id: string): Promise<string>;
}
