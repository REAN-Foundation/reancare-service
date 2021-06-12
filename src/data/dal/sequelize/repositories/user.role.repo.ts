
import { IUserRoleRepo } from "../../../repository.interfaces/user.role.repo.interface";
import { Role } from '../models/role.model';
import { UserRole } from '../models/user.role.model';
import { Sequelize } from "sequelize/types";
import { RoleDTO } from "../../../../data/dtos/role.dto";
import { UserRoleDTO } from "../../../../data/dtos/user.role.dto";


export class UserRoleRepo implements IUserRoleRepo {

    getUserRoles(userId: string): Promise<UserRoleDTO[]> {
        throw new Error("Method not implemented.");
    }
    addUserRole(userId: string, role: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    removeUserRole(userId: string, role: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getUserCountByRoles(): Promise<any> {
        throw new Error("Method not implemented.");
    }


}
