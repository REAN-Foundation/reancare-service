import { UserDTO, UserDTOLight } from "../../../domain.types/user.domain.types";
import { IUserRepo } from "../../../repository.interfaces/user.repo.interface";
import { User } from '../models/user.model';
import { UserMapper } from "../mappers/user.mapper";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { Op } from "sequelize/types";

///////////////////////////////////////////////////////////////////////////////////

export class UserRepo implements IUserRepo {
    userExistsWithPhone = async (phone: string): Promise<boolean> => {
        if (phone != null && typeof phone != 'undefined') {
            var existing = await User.findOne({ where: { Phone: phone } });
            return existing != null;
        }
        return false;
    };

    getUserWithPhone = async (phone: string): Promise<UserDTO> => {
        if (phone != null && typeof phone != 'undefined') {
            var user = await User.findOne({ where: { Phone: phone } });
            return await UserMapper.toDTO(user);
        }
        return null;
    };

    userExistsWithEmail = async (email: string): Promise<boolean> => {
        if (email != null && typeof email != 'undefined') {
            var existing = await User.findOne({ where: { Email: email } });
            return existing != null;
        }
        return false;
    };

    getUserWithEmail = async (email: string): Promise<UserDTO> => {
        if (email != null && typeof email != 'undefined') {
            var user = await User.findOne({ where: { Email: email } });
            return await UserMapper.toDTO(user);
        }
        return null;
    };

    userExistsWithUsername = async (userName: string): Promise<boolean> => {
        if (userName != null && typeof userName != 'undefined') {
            var existing = await User.findOne({ where: { UserName: { [Op.like]: '%' + userName + '%' } } });
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
    };

    searchLight(filters: any): Promise<UserDTOLight[]> {
        throw new Error('Method not implemented.');
    }

    searchFull(filters: any): Promise<UserDTO[]> {
        throw new Error('Method not implemented.');
    }

    getUserHashedPassword = async (id: string): Promise<string> => {
        var user = await User.findByPk(id);
        if (user == null) {
            return null;
        }
        return user.Password;
    };
}
