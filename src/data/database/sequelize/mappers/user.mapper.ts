import { UserDto, UserDtoLight } from "../../../domain.types/user.domain.types";
import { UserRepo } from "../repositories/user.repo";
import { UserRoleRepo } from "../repositories/user.role.repo";
import { RoleRepo } from "../repositories/role.repo";
import { User } from '../models/user.model';
import { Sequelize } from "sequelize/types";
import { Helper } from '../../../../common/helper';
import { NotThere } from '../../../../common/system.types';
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { UserRole } from "../models/user.role.model";

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toDto = async (user: User): Promise<UserDto> => {

        if(user == null){
            return null;
        }

        var prefix = user.Prefix ? (user.Prefix + ' ') : '';
        var firstName = user.FirstName ? (user.FirstName + ' ') : '';
        const displayName:string = prefix + firstName + user.LastName ?? '';
        const age = Helper.getAgeFromBirthDate(user.BirthDate);

        var userRoleRepo = new UserRoleRepo();
        const userRoles = await userRoleRepo.getUserRoles(user.id);

        var dto: UserDto = {
            id: user.id,
            UserName: user.UserName,
            Prefix: user.Prefix,
            FirstName: user.FirstName,
            MiddleName: user.MiddleName,
            LastName: user.LastName,
            DisplayName: displayName,
            Gender: user.Gender,
            BirthDate: user.BirthDate,
            Age: age,
            Phone: user.Phone,
            Email: user.Email,
            ImageResourceId: user.ImageResourceId,
            ActiveSince: user.CreateAt,
            IsActive: user.IsActive,
            LastLogin: user.LastLogin,
            Roles: userRoles
        };
        return dto;
    }

    toLightDto = (user: User) => {
        
    }
}