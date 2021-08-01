import { UserDetailsDto, UserDomainModel, UserDto } from "../../../domain.types/user.domain.types";
import { IUserRepo } from "../../../repository.interfaces/user.repo.interface";
import User from '../models/user.model';
import { UserMapper } from "../mappers/user.mapper";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { Op } from 'sequelize';
import PersonRole from "../models/person.role.model";
import { Helper } from "../../../../common/helper";

///////////////////////////////////////////////////////////////////////////////////

export class UserRepo implements IUserRepo {

    userNameExists = async (userName: string): Promise<Boolean> => {
        if (userName != null && typeof userName != 'undefined') {
            var existing = await User.findOne({ where: { UserName: userName } });
            return existing != null;
        }
        return false;
    };

    getUserByPersonIdAndRole = async (personId: string, roleId: number): Promise<UserDetailsDto> => {
        if (Helper.isStr(personId) && Helper.isNum(roleId)) {
            var user = await User.findOne({ where: { PersonId: personId, RoleId: roleId } });
            return await UserMapper.toDetailsDto(user);
        }
        return null;
    };

    userExistsWithUsername = async (userName: string): Promise<boolean> => {
        if (userName != null && typeof userName != 'undefined') {
            var existing = await User.findOne({
                where: {
                    UserName: { [Op.like]: '%' + userName + '%' }
                },
            });
            return existing != null;
        }
        return false;
    };

    userExistsWithPhone = async (phone: string): Promise<boolean> => {
        if (phone == null || typeof phone != 'undefined') {
            return false;
        }
        var user = await User.findOne({ where: { Phone: phone } });
        if(user == null) {
            var phoneTemp: string = phone;
            phoneTemp = phoneTemp.replace(' ', '');
        }
        return user != null;
    };

    getUserWithUserName = async (userName: string): Promise<UserDetailsDto> => {
        if (userName != null && typeof userName != 'undefined') {
            var user = await User.findOne({
                where: {
                    UserName: { [Op.like]: '%' + userName + '%' }
                },
            });
            var dto = await UserMapper.toDetailsDto(user);
            return dto;
        }
        return null;
    };

    create = async (userDomainModel: UserDomainModel): Promise<UserDetailsDto> => {
        try {
            var entity = {
                PersonId: userDomainModel.Person.id,
                RoleId: userDomainModel.RoleId ?? null,
                UserName: userDomainModel.UserName,
                Password: userDomainModel.Password ?? null,
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
            var user = await User.findByPk(id);
            var dto = await UserMapper.toDetailsDto(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, userDomainModel: UserDomainModel): Promise<UserDetailsDto> => {
        try {
            var user = await User.findByPk(id);

            if (userDomainModel.DefaultTimeZone != null) {
                user.DefaultTimeZone = userDomainModel.DefaultTimeZone;
            }
            if (userDomainModel.CurrentTimeZone != null) {
                user.CurrentTimeZone = userDomainModel.CurrentTimeZone;
            }
            if (userDomainModel.UserName != null) {
                user.UserName = userDomainModel.UserName;
            }
            if (userDomainModel.Password != null) {
                user.Password = userDomainModel.Password;
            }
            if (userDomainModel.LastLogin != null) {
                user.LastLogin = userDomainModel.LastLogin;
            }
            await user.save();

            var dto = await UserMapper.toDetailsDto(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUserHashedPassword = async (id: string): Promise<string> => {
        var user = await User.findByPk(id);
        if (user == null) {
            return null;
        }
        return user.Password;
    };
}
