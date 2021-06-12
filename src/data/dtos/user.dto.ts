import { UserRoleDTO } from './user.role.dto';

export interface UserDTO {
    id: string;
    UserName: string;
    Prefix: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: string;
    BirthDate: Date;
    Age: string;
    ImageResourceId: string;
    Roles: UserRoleDTO[];
    IsActive: boolean;
    ActiveSince: Date;
    LastLogin: Date;
}

export interface UserDTOLight {
    id: string;
    DisplayName: string;
    Phone: string;
    Email: string;
    Gender: string;
    BirthDate: Date;
}
