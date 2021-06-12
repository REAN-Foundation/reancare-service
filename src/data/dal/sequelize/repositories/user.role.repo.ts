
import { IUserRoleRepo } from "../../../repository.interfaces/user.role.repo.interface";
import { Role } from '../models/role.model';
import { UserRole } from '../models/user.role.model';
import { Sequelize } from "sequelize/types";
import { RoleDTO } from "../../../../data/dtos/role.dto";
import { UserRoleDTO } from "../../../../data/dtos/user.role.dto";
import { UserRoleMapper } from '../mappers/user.role.mapper';
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";


export class UserRoleRepo implements IUserRoleRepo {
    
    getUserRoles(userId: string): Promise<UserRoleDTO[]> {
        throw new Error('Method not implemented.');
    }

    addUserRole = async (userId: string, roleId: number): Promise<UserRoleDTO> => {
        try {
            var entity = {
                UserId: userId,
                RoleId: roleId,
            };
            var userRole = await UserRole.create(entity);
            var dto = await UserRoleMapper.toDTO(userRole);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    removeUserRole(userId: string, roleId: number): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    getUserCountByRoles(): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
