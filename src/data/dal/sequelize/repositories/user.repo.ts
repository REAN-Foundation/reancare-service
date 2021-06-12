import { UserDTO, UserDTOLight } from "../../../dtos/user.dto";
import { IUserRepo } from "../../../repository.interfaces/user.repo.interface";
import { User } from '../models/user.model';
import { UserMapper } from "../mappers/user.mapper";
import { Sequelize } from "sequelize/types";
import { Helper } from '../../../../common/helper';
import { NotThere } from '../../../../common/system.types';
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";

///////////////////////////////////////////////////////////////////////////////////

export class UserRepo implements IUserRepo {
    
    userExistsWithPhone = async (phone: string): Promise<boolean> => {
        if (phone != null && typeof phone != 'undefined') {
            var existing = await User.findOne({ where: { Phone: phone } });
            return existing != null;
        }
        return false;
    };

    userExistsWithEmail = async (email: string): Promise<boolean> => {
        if (email != null && typeof email != 'undefined') {
            var existing = await User.findOne({ where: { Email: email } });
            return existing != null;
        }
        return false;
    };

    create = async (userEntity: any): Promise<UserDTO> => {
        try {
            var entity = {
                Prefix: userEntity.Prefix ?? '',
                FirstName: userEntity.FirstName,
                MiddleName: userEntity.MiddleName ?? null,
                LastName: userEntity.LastName,
                Phone: userEntity.Phone,
                Email: userEntity.Email ?? null,
                UserName: userEntity.UserName,
                Password: userEntity.Password ?? null,
                Gender: userEntity.Gender ?? 'Unknown',
                BirthDate: userEntity.BirthDate ?? null,
                ImageResourceId: userEntity.ImageResourceId ?? null,
            };

            var user = await User.create(entity);
            var dto = await UserMapper.toDTO(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<UserDTO> => {
        try {
            var user = await User.findByPk(id);
            var dto = await UserMapper.toDTO(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            var user = await User.findByPk(id);
            user.IsActive = false;
            await user.save();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    searchLight(filters: any): Promise<UserDTOLight[]> {
        throw new Error('Method not implemented.');
    }

    searchFull(filters: any): Promise<UserDTO[]> {
        throw new Error('Method not implemented.');
    }


}
