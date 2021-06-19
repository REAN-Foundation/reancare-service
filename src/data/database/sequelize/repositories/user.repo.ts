import { UserDetailsDto, UserDomainModel, UserDto } from "../../../domain.types/user.domain.types";
import { IUserRepo } from "../../../repository.interfaces/user.repo.interface";
import User from '../models/user.model';
import { UserMapper } from "../mappers/user.mapper";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { Op } from 'sequelize';
import UserRole from "../models/user.role.model";

///////////////////////////////////////////////////////////////////////////////////

export class UserRepo implements IUserRepo {

    userNameExists = async (userName: string): Promise<Boolean> => {
        if (userName != null && typeof userName != 'undefined') {
            var existing = await User.findOne({ where: { UserName: userName } });
            return existing != null;
        }
        return false;
    }

    userExistsWithPhone = async (phone: string): Promise<boolean> => {
        if (phone != null && typeof phone != 'undefined') {
            var existing = await User.findOne({ where: { Phone: phone, IsActive: true } });
            return existing != null;
        }
        return false;
    };

    getUserWithPhone = async (phone: string): Promise<UserDetailsDto> => {
        if (phone != null && typeof phone != 'undefined') {
            var user = await User.findOne({ where: { Phone: phone, IsActive: true } });
            return await UserMapper.toDetailsDto(user);
        }
        return null;
    };

    getAllUsersWithPhoneAndRole = async (phone: string, roleId: number): Promise<UserDetailsDto[]> => {
        if (phone != null && typeof phone != 'undefined') {
            //KK: To be optimized with associations

            var usersWithRole: UserDetailsDto[] = [];
            var users = await User.findAll({ where: { Phone: phone, IsActive: true } });
            for await (var user of users) {
                var withRole = await UserRole.findOne({ where: { UserId: user.id, RoleId: roleId } });
                if (withRole != null) {
                    var dto = await UserMapper.toDetailsDto(user);
                    usersWithRole.push(dto);
                }
            }
            return usersWithRole;
        }
        return null;
    };

    userExistsWithEmail = async (email: string): Promise<boolean> => {
        if (email != null && typeof email != 'undefined') {
            var existing = await User.findOne({ where: { Email: email, IsActive: true } });
            return existing != null;
        }
        return false;
    };

    getUserWithEmail = async (email: string): Promise<UserDetailsDto> => {
        if (email != null && typeof email != 'undefined') {
            var user = await User.findOne({ where: { Email: email, IsActive: true } });
            return await UserMapper.toDetailsDto(user);
        }
        return null;
    };

    userExistsWithUsername = async (userName: string): Promise<boolean> => {
        if (userName != null && typeof userName != 'undefined') {
            var existing = await User.findOne({
                where: {
                    UserName: { [Op.like]: '%' + userName + '%' },
                    IsActive: true,
                },
            });
            return existing != null;
        }
        return false;
    };

    create = async (userDomainModel: UserDomainModel): Promise<UserDetailsDto> => {
        try {

            var entity = {
                Prefix: userDomainModel.Prefix ?? '',
                FirstName: userDomainModel.FirstName,
                MiddleName: userDomainModel.MiddleName ?? null,
                LastName: userDomainModel.LastName,
                Phone: userDomainModel.Phone,
                Email: userDomainModel.Email ?? null,
                UserName: userDomainModel.UserName,
                Password: userDomainModel.Password ?? null,
                Gender: userDomainModel.Gender ?? 'Unknown',
                BirthDate: userDomainModel.BirthDate ?? null,
                ImageResourceId: userDomainModel.ImageResourceId ?? null,
                DefaultTimeZone: userDomainModel.DefaultTimeZone ?? '+05:30',
                CurrentTimeZone: userDomainModel.DefaultTimeZone ?? '+05:30',
            };
            var user = await User.create(entity);
            var dto = await UserMapper.toDetailsDto(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<UserDetailsDto> => {
        try {
            var user = await User.findOne({ where: { id: id, IsActive: true } });
            var dto = await UserMapper.toDetailsDto(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    exists = async (id: string): Promise<boolean> => {
        try {
            var user = await User.findOne({ where: { id: id, IsActive: true } });
            return user != null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, userDomainModel: UserDomainModel): Promise<UserDetailsDto> => {
        try {
            var user = await User.findOne({ where: { id: id, IsActive: true } });

            if (userDomainModel.Prefix != null) {
                user.Prefix = userDomainModel.Prefix;
            }
            if (userDomainModel.FirstName != null) {
                user.FirstName = userDomainModel.FirstName;
            }
            if (userDomainModel.LastName != null) {
                user.LastName = userDomainModel.LastName;
            }
            if (userDomainModel.Phone != null) {
                user.Phone = userDomainModel.Phone;
            }
            if (userDomainModel.Email != null) {
                user.Email = userDomainModel.Email;
            }
            if (userDomainModel.Gender != null) {
                user.Gender = userDomainModel.Gender;
            }
            if (userDomainModel.BirthDate != null) {
                user.BirthDate = userDomainModel.BirthDate;
            }
            if (userDomainModel.ImageResourceId != null) {
                user.ImageResourceId = userDomainModel.ImageResourceId;
            }
            await user.save();

            var dto = await UserMapper.toDetailsDto(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            var user = await User.findOne({ where: { id: id, IsActive: true } });
            user.IsActive = false;
            await user.save();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    searchLight(filters: any): Promise<UserDto[]> {
        throw new Error('Method not implemented.');
    }

    searchFull(filters: any): Promise<UserDetailsDto[]> {
        throw new Error('Method not implemented.');
    }

    getUserHashedPassword = async (id: string): Promise<string> => {
        var user = await User.findOne({ where: { id: id, IsActive: true } });
        if (user == null) {
            return null;
        }
        return user.Password;
    };
}
