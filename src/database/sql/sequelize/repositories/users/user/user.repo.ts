import { Op } from 'sequelize';
import { ApiError } from "../../../../../../common/api.error";
import { Helper } from "../../../../../../common/helper";
import { Logger } from "../../../../../../common/logger";
import { UserDomainModel } from "../../../../../../domain.types/users/user/user.domain.model";
import { UserDetailsDto } from "../../../../../../domain.types/users/user/user.dto";
import { IUserRepo } from "../../../../../repository.interfaces/users/user/user.repo.interface";
import { UserMapper } from "../../../mappers/users/user/user.mapper";
import Person from "../../../models/person/person.model";
import User from '../../../models/users/user/user.model';

///////////////////////////////////////////////////////////////////////////////////

export class UserRepo implements IUserRepo {

    userNameExists = async (userName: string): Promise<boolean> => {
        if (userName != null && typeof userName !== 'undefined') {
            const existing = await User.findOne({ where: { UserName: userName } });
            return existing != null;
        }
        return false;
    };

    getUserByPersonIdAndRole = async (personId: string, roleId: number): Promise<UserDetailsDto> => {
        if (Helper.isStr(personId) && Helper.isNum(roleId)) {
            const user = await User.findOne({ where: { PersonId: personId, RoleId: roleId } });
            return await UserMapper.toDetailsDto(user);
        }
        return null;
    };

    getByEmailAndRole = async (email: any, roleId: number): Promise<UserDetailsDto> => {

        const person = await Person.findOne({
            where : {
                Email : { [Op.like]: '%' + email + '%' },
            },
        });

        if (person === null) {
            return null;
        }

        const user = await User.findOne({
            where : {
                RoleId   : roleId,
                PersonId : person.id,
            },
        });

        return await UserMapper.toDetailsDto(user);
    };

    getByPhoneAndRole = async (phone: string, roleId: number) => {

        const person = await Person.findOne({
            where : {
                Phone : { [Op.like]: '%' + phone + '%' }
            }
        });

        if (person === null) {
            return null;
        }

        const user = await User.findOne(
            {
                where : {
                    RoleId   : roleId,
                    PersonId : person.id
                },
            });

        return await UserMapper.toDetailsDto(user);
    };

    userExistsWithUsername = async (userName: string): Promise<boolean> => {
        if (userName != null && typeof userName !== 'undefined') {
            const existing = await User.findOne({
                where : {
                    UserName : { [Op.like]: '%' + userName + '%' }
                },
            });
            return existing != null;
        }
        return false;
    };

    userExistsWithPhone = async (phone: string): Promise<boolean> => {
        if (phone == null || typeof phone !== 'undefined') {
            return false;
        }
        const user = await User.findOne({ where: { Phone: phone } });

        // if (user == null) {
        //     let phoneTemp: string = phone;
        //     phoneTemp = phoneTemp.replace(' ', '');
        // }

        return user != null;
    };

    getUserWithUserName = async (userName: string): Promise<UserDetailsDto> => {
        if (userName != null && typeof userName !== 'undefined') {
            const user = await User.findOne({
                where : {
                    UserName : { [Op.like]: '%' + userName + '%' }
                },
            });
            const dto = await UserMapper.toDetailsDto(user);
            return dto;
        }
        return null;
    };

    create = async (userDomainModel: UserDomainModel): Promise<UserDetailsDto> => {
        try {
            const entity = {
                PersonId        : userDomainModel.Person.id,
                RoleId          : userDomainModel.RoleId ?? null,
                UserName        : userDomainModel.UserName,
                Password        : userDomainModel.Password ? Helper.hash(userDomainModel.Password) : null,
                DefaultTimeZone : userDomainModel.DefaultTimeZone ?? '+05:30',
                CurrentTimeZone : userDomainModel.DefaultTimeZone ?? '+05:30',
            };
            const user = await User.create(entity);
            const dto = await UserMapper.toDetailsDto(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<UserDetailsDto> => {
        try {
            const user = await User.findByPk(id);
            const dto = await UserMapper.toDetailsDto(user);

            Logger.instance().log(`User mapper DTO: ${JSON.stringify(dto)}`);

            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateLastLogin = async (id: string): Promise<void> => {
        try {
            var user = await User.findByPk(id);
            user.LastLogin = new Date();
            await user.save();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, userDomainModel: UserDomainModel): Promise<UserDetailsDto> => {
        try {
            var user = await User.findByPk(id);

            if (userDomainModel.DefaultTimeZone !== undefined &&
                userDomainModel.DefaultTimeZone !== null &&
                userDomainModel.DefaultTimeZone.length > 0) {
                user.DefaultTimeZone = userDomainModel.DefaultTimeZone;
            }
            if (userDomainModel.CurrentTimeZone !== undefined &&
                userDomainModel.CurrentTimeZone !== null &&
                userDomainModel.CurrentTimeZone.length > 0) {
                user.CurrentTimeZone = userDomainModel.CurrentTimeZone;
            }
            if (userDomainModel.UserName !== undefined &&
                userDomainModel.UserName !== null &&
                userDomainModel.UserName.length > 0) {
                user.UserName = userDomainModel.UserName;
            }
            if (userDomainModel.Password !== undefined &&
                userDomainModel.Password !== null &&
                userDomainModel.Password.length > 0) {
                user.Password = Helper.hash(userDomainModel.Password);
            }
            if (userDomainModel.LastLogin != null) {
                user.LastLogin = userDomainModel.LastLogin;
            }
            await user.save();

            const dto = await UserMapper.toDetailsDto(user);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const count = await User.destroy({
                where : {
                    id : id
                }
            });
            return count === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getUserHashedPassword = async (id: string): Promise<string> => {
        const user = await User.findByPk(id);
        if (user == null) {
            return null;
        }
        return user.Password;
    };

}
