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
import Tenant from '../../../models/tenant/tenant.model';
import TenantUser from '../../../models/tenant/tenant.user.model';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { TenantMapper } from '../../../mappers/tenant/tenant.mapper';
import { TenantDto } from '../../../../../../domain.types/tenant/tenant.dto';

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

    create = async (model: UserDomainModel): Promise<UserDetailsDto> => {
        try {
            const entity = {
                PersonId        : model.Person.id,
                RoleId          : model.RoleId ?? null,
                UserName        : model.UserName,
                IsTestUser      : model.IsTestUser ?? false,
                Password        : model.Password ? Helper.hash(model.Password) : null,
                DefaultTimeZone : model.DefaultTimeZone ?? '+05:30',
                CurrentTimeZone : model.DefaultTimeZone ?? '+05:30',
            };
            const user = await User.create(entity);

            // Add user to tenant
            var tenant = null;
            if (model.TenantId != null) {
                tenant = await Tenant.findByPk(model.TenantId);
                if (tenant != null) {
                    const tenantUser = await TenantUser.create({
                        UserId   : user.id,
                        TenantId : tenant.id,
                        Admin    : false,
                    });
                    Logger.instance().log(`Tenant user created: ${JSON.stringify(tenantUser)}`);
                }
            }
            return UserMapper.toDetailsDto(user, tenant);
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
            if (userDomainModel.IsTestUser !== undefined &&
                userDomainModel.IsTestUser !== null) {
                user.IsTestUser = userDomainModel.IsTestUser;
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
            //Destroy tenant user
            await TenantUser.destroy({
                where : {
                    UserId : id
                }
            });
            return count === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUserHashedPassword = async (id: string): Promise<string> => {
        const user = await User.findByPk(id);
        if (user == null) {
            return null;
        }
        return user.Password;
    };

    checkUsersWithoutTenants = async (): Promise<void> => {
        try {

            const tentant = await Tenant.findOne({
                where : {
                    Code : 'default'
                }
            });

            const users = await User.findAll({
                attributes : ['id']
            });

            for await (const user of users) {
                var tenantUser = await TenantUser.findOne({
                    where : {
                        UserId : user.id
                    }
                });
                if (tenantUser == null) {
                    await TenantUser.create({
                        UserId    : user.id,
                        TenantId  : tentant.id,
                        Admin     : false,
                        Moderator : false
                    });
                    // Logger.instance().log(`Tenant user associated: ${JSON.stringify(x)}`);
                }
            }
        }   catch (error) {
            Logger.instance().log(error.message);
            //throw new ApiError(500, error.message);
        }
    };

    public isTenantUser = async (userId: uuid, tenantId: uuid): Promise<boolean> => {
        try {
            var tenantUser = await TenantUser.findOne({
                where : {
                    UserId   : userId,
                    TenantId : tenantId
                }
            });
            return tenantUser != null;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getTenantsForUser = async (userId: uuid): Promise<TenantDto[]> => {
        try {
            var tenantUsers = await TenantUser.findAll({
                where : {
                    UserId : userId
                },
                include : [
                    {
                        model : Tenant,
                        as    : 'Tenant'
                    }
                ]
            });
            var tenants = tenantUsers.map(x => x.Tenant);
            return tenants.map(x => TenantMapper.toDto(x));
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
