
import { IUserRoleRepo } from "../../../repository.interfaces/user.role.repo.interface";
import { UserRole } from '../models/user.role.model';
import { UserRoleDto } from "../../../domain.types/role.domain.types";
import { UserRoleMapper } from '../mappers/user.role.mapper';
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { RoleRepo } from "./role.repo";

///////////////////////////////////////////////////////////////////////

export class UserRoleRepo implements IUserRoleRepo {

    getUserRoles = async (userId: string): Promise<UserRoleDto[]> => {
        try {
            var userRoles = await UserRole.findAll({where: {UserId: userId}});
            var dtos: UserRoleDto[] = [];
            for await(var r of userRoles) {
                var dto = await UserRoleMapper.toDto(r);
                dtos.push(dto);
            }          
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    addUserRole = async (userId: string, roleId: number): Promise<UserRoleDto> => {
        try {
            var entity = {
                UserId: userId,
                RoleId: roleId,
            };
            var userRole = await UserRole.create(entity);
            var dto = await UserRoleMapper.toDto(userRole);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    removeUserRole = async (userId: string): Promise<boolean> => {
        try {
            await UserRole.destroy({where: {UserId: userId}});
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getUserCountByRoles = async (): Promise<any> => {
        try {
            var userCountForRoles = {};
            var roleRepo = new RoleRepo();
            var allRoles = await roleRepo.search();
            for await(var r of allRoles) {
                var roleCount = await UserRole.count({
                    where: {
                        RoleId: r.id,
                    },
                });
                userCountForRoles[r.RoleName] = roleCount;
            }  
            return userCountForRoles;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }
}
