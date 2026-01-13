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
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { TenantMapper } from '../../../mappers/tenant/tenant.mapper';
import { TenantDto } from '../../../../../../domain.types/tenant/tenant.dto';
import { PersonMapper } from '../../../mappers/person/person.mapper';
import Role from '../../../models/role/role.model';
import { UserSearchFilters, UserSearchResults } from '../../../../../../domain.types/users/user/user.search.types';
import { SupportedLanguage } from '../../../../../../domain.types/users/user/user.types';
import { MostRecentActivityDto } from '../../../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto';

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

    getByUserName = async (userName: string): Promise<UserDetailsDto> => {
        const user = await User.findOne({ where: { UserName: userName } });
        if (user == null) {
            return null;
        }
        const person = await Person.findByPk(user.PersonId);
        const personDto = await PersonMapper.toDetailsDto(person);
        const tenant = await Tenant.findByPk(user.TenantId);
        return UserMapper.toDetailsDto(user, tenant, personDto);
    };

    getUserByTenantIdAndRole = async (tenantId: string, roleName: string): Promise<UserDetailsDto> => {
        if (!Helper.isStr(tenantId) || !Helper.isStr(roleName)) {
            return null;
        }
        const user = await User.findOne({
            where : {
                TenantId : tenantId
            },
            include : [
                {
                    model : Role,
                    as    : 'Role',
                    where : {
                        RoleName : roleName
                    }
                }
            ]
        });
        return await UserMapper.toDetailsDto(user);
    };

    getByPersonId = async (personId: string): Promise<UserDetailsDto[]> => {
        try {
            var users: UserDetailsDto[] = [];
            const users_ = await User.findAll({ where: { PersonId: personId } });
            for await (const user of users_) {
                const tenant = await Tenant.findByPk(user.TenantId);
                const person = await Person.findByPk(personId);
                const role = await Role.findByPk(user.RoleId);
                const personDto = await PersonMapper.toDetailsDto(person);
                var dto = UserMapper.toDetailsDto(user, tenant, personDto, role);
                users.push(dto);
            }
            return users;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
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

    getByUniqueReferenceIdAndRole = async (uniqueReferenceId: string, roleId: number): Promise<UserDetailsDto> => {
        if (!uniqueReferenceId || !roleId) {
            return null;
        }
        const person = await Person.findOne({ where: { UniqueReferenceId: uniqueReferenceId } });
        if (person == null) {
            return null;
        }
        const user = await User.findOne({ where: { PersonId: person.id, RoleId: roleId } });
        return UserMapper.toDetailsDto(user);
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
                    UserName : userName
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
                PersonId          : model.Person.id,
                RoleId            : model.RoleId ?? null,
                TenantId          : model.TenantId ?? null,
                UserName          : model.UserName,
                IsTestUser        : model.IsTestUser ?? false,
                PreferredLanguage : model.PreferredLanguage ?? SupportedLanguage.English,
                Password          : model.Password ? Helper.hash(model.Password) : null,
                DefaultTimeZone   : model.DefaultTimeZone ?? '+05:30',
                CurrentTimeZone   : model.CurrentTimeZone ?? model.DefaultTimeZone ?? '+05:30',
            };
            const user = await User.create(entity);

            // Add user to tenant
            var tenant = null;
            if (model.TenantId != null) {
                tenant = await Tenant.findByPk(model.TenantId);
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
            if (userDomainModel.PreferredLanguage !== undefined &&
                userDomainModel.PreferredLanguage !== null &&
                userDomainModel.PreferredLanguage.length > 0) {
                user.PreferredLanguage = userDomainModel.PreferredLanguage;
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

    search = async (filters: UserSearchFilters): Promise<UserSearchResults> => {
        try {

            const search: any = { where: {}, include: [] };
            const includesObj =
            {
                model    : Person,
                required : true,
                where    : {
                },
            };

            if (filters.TenantId) {
                search.where['TenantId'] = filters.TenantId;
            }
            if (filters.UserName) {
                search.where['UserName'] = { [Op.like]: '%' + filters.UserName + '%' };
            }
            if (filters.RoleIds) {
                search.where['RoleId'] = { [Op.in]: filters.RoleIds };
            }
            if (filters.UserId) {
                search.where['id'] = filters.UserId;
            }
            if (filters.Phone) {
                includesObj.where['Phone'] = { [Op.like]: '%' + filters.Phone + '%' };
            }
            if (filters.Email) {
                includesObj.where['Email'] = { [Op.like]: '%' + filters.Email + '%' };
            }
            if (filters.Name != null) {
                includesObj.where[Op.or] = [
                    {
                        FirstName : { [Op.like]: '%' + filters.Name + '%' },
                    },
                    {
                        LastName : { [Op.like]: '%' + filters.Name + '%' },
                    },
                ];
            }
            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            }
            else if (filters.CreatedDateFrom == null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            }
            else if (filters.CreatedDateFrom != null && filters.CreatedDateTo == null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }

            search.include.push(includesObj);
            const orderByColum = 'CreatedAt';
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];
            if (filters.OrderBy) {
                const personAttributes = ['FirstName', 'LastName', 'BirthDate', 'Gender', 'Phone', 'Email'];
                const isPersonColumn = personAttributes.includes(filters.OrderBy);
                if (isPersonColumn) {
                    search['order'] = [[ 'Person', filters.OrderBy, order]];
                }
            }
            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await User.findAndCountAll(search);
            const dtos = foundResults.rows.map(x => UserMapper.toDetailsDto(x, null, PersonMapper.toDetailsDto(x.Person)));

            const searchResults: UserSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
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
    };

    getUserHashedPassword = async (id: string): Promise<string> => {
        const user = await User.findByPk(id);
        if (user == null) {
            return null;
        }
        return user.Password;
    };

    updateUserHashedPassword = async (id: string, newPasswordHash: string): Promise<void> => {
        try {
            var user = await User.findByPk(id);
            user.Password = newPasswordHash;
            await user.save();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    checkUsersWithoutTenants = async (): Promise<void> => {
        try {

            const tentant = await Tenant.findOne({
                where : {
                    Code : 'default'
                }
            });

            const users = await User.findAll({
                where : {
                    TenantId : null
                },
                attributes : ['id']
            });

            for await (const user of users) {
                var record = await User.findOne({
                    where : {
                        id : user.id
                    }
                });
                record.TenantId = tentant.id;
                await record.save();
                // Logger.instance().log(`User associated: ${JSON.stringify(x)}`);
            }
        }   catch (error) {
            Logger.instance().log(error.message);
            //throw new ApiError(500, error.message);
        }
    };

    public isTenantUser = async (userId: uuid, tenantId: uuid): Promise<boolean> => {
        try {
            var user = await User.findOne({
                where : {
                    id       : userId,
                    TenantId : tenantId
                }
            });
            return user != null;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllRegisteredUsers = async (): Promise<any[]> => {
        try {
            var users = await User.findAll();
            return users;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getTenantsForUser = async (userId: uuid): Promise<TenantDto[]> => {
        try {
            var tenantUsers = await User.findAll({
                where : {
                    id : userId
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

    getRecentUserActivity = async (): Promise<MostRecentActivityDto[]> => {
        try {
            const users = await User.findAll({});
               
            const dtos = users.map(user => {
                return {
                    PatientUserId      : user.id,
                    RecentActivityDate : user.UpdatedAt,
                };
            });
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            return [];
        }
    };

}
