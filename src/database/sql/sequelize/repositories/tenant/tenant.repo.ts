import Tenant from '../../models/tenant/tenant.model';
import { TenantDto } from '../../../../../domain.types/tenant/tenant.dto';
import { TenantSearchFilters, TenantSearchResults } from '../../../../../domain.types/tenant/tenant.search.types';
import { TenantDomainModel } from '../../../../../domain.types/tenant/tenant.domain.model';
import { ITenantRepo } from '../../../../../database/repository.interfaces/tenant/tenant.repo.interface';
import { TenantMapper } from '../../mappers/tenant/tenant.mapper';
import { Op } from 'sequelize';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import Cohort from '../../models/community/cohorts/cohort.model';
import User from '../../models/users/user/user.model';
import Person from '../../models/person/person.model';
import Role from '../../models/role/role.model';
import { Roles } from '../../../../../domain.types/role/role.types';

///////////////////////////////////////////////////////////////////////////////////

export class TenantRepo implements ITenantRepo {

    create = async (model: TenantDomainModel): Promise<TenantDto> => {
        try {
            const entity = {
                Name        : model.Name,
                Description : model.Description,
                Code        : model.Code,
                Phone       : model.Phone,
                Email       : model.Email,
            };
            const tenant = await Tenant.create(entity);
            return TenantMapper.toDto(tenant);
        }
        catch (error) {
            const msg = error.message + '. ' + error?.original?.message;
            throw new Error(`Failed to create tenant: ${msg}`);
        }
    };

    getById = async (id: uuid): Promise<TenantDto> => {
        try {
            const tenant = await Tenant.findByPk(id);
            return TenantMapper.toDto(tenant);
        }
        catch (error) {
            throw new Error(`Failed to fetch tenant by id: ${error.message}`);
        }
    };

    getTenantWithPhone = async (phone: string): Promise<TenantDto> => {
        try {
            const tenant = await Tenant.findOne({ where: { Phone: phone } });
            return TenantMapper.toDto(tenant);
        }
        catch (error) {
            throw new Error(`Failed to fetch tenant by phone: ${error.message}`);
        }
    };

    getTenantWithEmail = async (email: string): Promise<TenantDto> => {
        try {
            const tenant = await Tenant.findOne({ where: { Email: email } });
            return TenantMapper.toDto(tenant);
        }
        catch (error) {
            throw new Error(`Failed to fetch tenant by email: ${error.message}`);
        }
    };

    getTenantWithCode = async (code: string): Promise<TenantDto> => {
        try {
            const tenant = await Tenant.findOne({ where: { Code: code } });
            return TenantMapper.toDto(tenant);
        }
        catch (error) {
            throw new Error(`Failed to fetch tenant by code: ${error.message}`);
        }
    };

    tenantCount = async (): Promise<number> => {
        try {
            return await Tenant.count();
        }
        catch (error) {
            throw new Error(`Failed to fetch tenant count: ${error.message}`);
        }
    };

    exists = async (id: uuid): Promise<boolean> => {
        try {
            const tenant = await Tenant.findByPk(id);
            return tenant != null;
        }
        catch (error) {
            throw new Error(`Failed to check if tenant exists: ${error.message}`);
        }
    };

    search = async (filters: TenantSearchFilters): Promise<TenantSearchResults> => {
        try {
            const search = { where: {} };
            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.Code != null) {
                search.where['Code'] = { [Op.like]: '%' + filters.Code + '%' };
            }
            if (filters.Phone != null) {
                search.where['Phone'] = { [Op.like]: '%' + filters.Phone + '%' };
            }
            if (filters.Email != null) {
                search.where['Email'] = { [Op.like]: '%' + filters.Email + '%' };
            }
            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

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

            const foundResults = await Tenant.findAndCountAll(search);

            const dtos: TenantDto[] = foundResults.rows.map((tenant) => {
                return TenantMapper.toDto(tenant);
            });

            const searchResults: TenantSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
        }
        catch (error) {
            throw new Error(`Failed to search tenants: ${error.message}`);
        }
    };

    update = async (id: uuid, model: TenantDomainModel): Promise<TenantDto> => {
        try {
            const tenant = await Tenant.findByPk(id);

            if (model.Name != null) {
                tenant.Name = model.Name;
            }
            if (model.Description != null) {
                tenant.Description = model.Description;
            }
            if (model.Code != null) {
                tenant.Code = model.Code;
            }
            if (model.Phone != null) {
                tenant.Phone = model.Phone;
            }
            if (model.Email != null) {
                tenant.Email = model.Email;
            }

            await tenant.save();

            return TenantMapper.toDto(tenant);
        }
        catch (error) {
            throw new Error(`Failed to update tenant: ${error.message}`);
        }
    };

    delete = async (id: string, hardDelete: boolean = false): Promise<boolean> => {
        try {
            const deletedCount = await Tenant.destroy({ where: { Id: id }, force: hardDelete });
            return deletedCount > 0;
        }
        catch (error) {
            throw new Error(`Failed to delete tenant: ${error.message}`);
        }
    };

    promoteTenantUserAsAdmin = async (tenantId: uuid, userId: uuid): Promise<boolean> => {
        try {
            const tenantUserRole = await Role.findOne({ where: { RoleName: Roles.TenantUser } });
            if (tenantUserRole == null) {
                throw new Error(`Tenant user role not found!`);
            }
            const tenantAdminRole = await Role.findOne({ where: { RoleName: Roles.TenantAdmin } });
            if (tenantAdminRole == null) {
                throw new Error(`Tenant admin role not found!`);
            }
            var tenantUser = await User.findOne(
                {
                    where : {
                        TenantId : tenantId,
                        id       : userId,
                        RoleId   : tenantUserRole.id
                    }
                }
            );
            if (tenantUser == null) {
                throw new Error(`User is not tenant user!`);
            }
            tenantUser.RoleId = tenantAdminRole.id;
            await tenantUser.save();
            return true;
        }
        catch (error) {
            throw new Error(`Failed to add user as admin to tenant: ${error.message}`);
        }
    };

    demoteAdmin = async (tenantId: uuid, userId: uuid): Promise<boolean> => {
        try {
            const tenantUserRole = await Role.findOne({ where: { RoleName: Roles.TenantUser } });
            if (tenantUserRole == null) {
                throw new Error(`Tenant user role not found!`);
            }
            const tenantAdminRole = await Role.findOne({ where: { RoleName: Roles.TenantAdmin } });
            if (tenantAdminRole == null) {
                throw new Error(`Tenant admin role not found!`);
            }
            var tenantUser = await User.findOne(
                {
                    where : {
                        TenantId : tenantId,
                        id       : userId,
                        RoleId   : tenantAdminRole.id
                    }
                }
            );
            if (tenantUser == null) {
                throw new Error(`User is not tenant user!`);
            }
            const tenantAdminCount = await User.count(
                {
                    where : {
                        TenantId : tenantId,
                        RoleId   : tenantAdminRole.id
                    }
                }
            );
            if (tenantAdminCount <= 1) {
                throw new Error(`Cannot demote the only admin user!`);
            }
            tenantUser.RoleId = tenantUserRole.id;
            await tenantUser.save();
            return true;
        }
        catch (error) {
            throw new Error(`Failed to remove user as admin from tenant: ${error.message}`);
        }
    };

    getTenantStats = async (id: uuid): Promise<any> => {
        try {
            const tenant = await Tenant.findByPk(id);
            if (tenant == null) {
                throw new Error(`Tenant not found!`);
            }
            const tenantUserRole = await Role.findOne({ where: { RoleName: Roles.TenantUser } });
            if (tenantUserRole == null) {
                throw new Error(`Tenant user role not found!`);
            }
            const tenantAdminRole = await Role.findOne({ where: { RoleName: Roles.TenantAdmin } });
            if (tenantAdminRole == null) {
                throw new Error(`Tenant admin role not found!`);
            }
            const usersCount = await User.count({ where: { TenantId: id } });
            const adminUsersCount = await User.count({ where: { TenantId: id, RoleId: tenantAdminRole.id } });
            const regularUsersCount = await User.count({ where: { TenantId: id, RoleId: tenantUserRole.id } });
            const cohortCount = await Cohort.count({ where: { TenantId: id } });

            const stats = {
                TotalUsers    : usersCount,
                TotalAdmins   : adminUsersCount,
                TotalRegulars : regularUsersCount,
                TotalCohorts  : cohortCount,
            };
            return stats;
        }
        catch (error) {
            throw new Error(`Failed to get tenant stats: ${error.message}`);
        }
    };

    getTenantAdmins = async (id: uuid): Promise<any[]> => {
        try {
            const role = await Role.findOne({ where: { RoleName: Roles.TenantAdmin } });
            if (role == null) {
                throw new Error(`Tenant admin role not found!`);
            }
            const tenantAdmins = await User.findAll({
                where : {
                    TenantId : id,
                    RoleId   : role.id
                },
                include : [
                    {
                        model    : Person,
                        as       : 'Person',
                        required : true,
                    }
                ]
            });
            const dtos = tenantAdmins.map((u) => {
                return {
                    id       : u.id,
                    UserName : u.UserName,
                    Person   : {
                        id                : u.Person.id,
                        FirstName         : u.Person.FirstName,
                        LastName          : u.Person.LastName,
                        Phone             : u.Person.Phone,
                        Email             : u.Person.Email,
                        ProfilePictureUrl : u.Person.ImageResourceId,
                    },
                    CreatedAt : u.createdAt,
                    UpdatedAt : u.updatedAt,
                };
            });
            return dtos;
        }
        catch (error) {
            throw new Error(`Failed to get tenant admins: ${error.message}`);
        }
    };

    getTenantRegularUsers = async (id: uuid): Promise<any[]> => {
        try {
            const role = await Role.findOne({ where: { RoleName: Roles.TenantUser } });
            if (role == null) {
                throw new Error(`Tenant user role not found!`);
            }
            const tenantAdmins = await User.findAll({
                where : {
                    TenantId : id,
                    RoleId   : role.id
                },
                include : [
                    {
                        model    : Person,
                        as       : 'Person',
                        required : true,
                    }
                ]
            });
            const dtos = tenantAdmins.map((u) => {
                return {
                    id       : u.id,
                    UserName : u.UserName,
                    Person   : {
                        id                : u.Person.id,
                        FirstName         : u.Person.FirstName,
                        LastName          : u.Person.LastName,
                        Phone             : u.Person.Phone,
                        Email             : u.Person.Email,
                        ProfilePictureUrl : u.Person.ImageResourceId,
                    },
                    CreatedAt : u.createdAt,
                    UpdatedAt : u.updatedAt,
                };
            });
            return dtos;
        }
        catch (error) {
            throw new Error(`Failed to get tenant moderators: ${error.message}`);
        }
    };

    getActiveTenants = async (): Promise<TenantDto[]> => {
        try {
            const tenants = await Tenant.findAll({
                where : { DeletedAt: null }
            });
            const dtos: TenantDto[] = tenants.map((tenant) => {
                return TenantMapper.toDto(tenant);
            });
            return dtos;
        }
        catch (error) {
            throw new Error(`Failed to fetch active tenants: ${error.message}`);
        }
    };

}
