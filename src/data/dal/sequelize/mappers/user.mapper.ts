import { UserDTO, UserDTOLight } from "../../../dtos/user.dto";
import { UserRepo } from "../../sequelize/repositories/user.repo";
import { UserRoleRepo } from "../../sequelize/repositories/user.role.repo";
import { RoleRepo } from "../../sequelize/repositories/role.repo";
import { User } from '../models/user.model';
import { Sequelize } from "sequelize/types";
import { Helper } from '../../../../common/helper';
import { NotThere } from '../../../../common/system.types';
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toDTO = async (user: User): Promise<UserDTO> => {

        if(user == null){
            return null;
        }

        var prefix = user.Prefix ? (user.Prefix + ' ') : '';
        var firstName = user.FirstName ? (user.FirstName + ' ') : '';
        const displayName:string = prefix + firstName + user.LastName ?? '';
        const age = Helper.getAgeFromBirthDate(user.BirthDate);

        var dto: UserDTO = {
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
            Roles: 
        };
        return dto;
    }

    toLightDTO = (user: User) => {
        
    }
}