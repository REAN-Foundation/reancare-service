import Tenant from '../../models/tenant/tenant.model';
import TenantUser from '../../models/tenant/tenant.user.model';
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

    delete = async (id: string): Promise<boolean> => {
        try {
            const deletedCount = await Tenant.destroy({ where: { Id: id } });
            return deletedCount > 0;
        }
        catch (error) {
            throw new Error(`Failed to delete tenant: ${error.message}`);
        }
    };

    addUserAsAdminToTenant = async (id: uuid, userId: uuid): Promise<boolean> => {
        try {
            var tenantUser = await TenantUser.findOne({ where: { TenantId: id, UserId: userId } });
            if (tenantUser == null) {
                const entity = {
                    TenantId : id,
                    UserId   : userId,
                    Admin    : true,
                };
                tenantUser = await TenantUser.create(entity);
                return tenantUser != null;
            }
            else {
                tenantUser.Admin = true;
                await tenantUser.save();
                return true;
            }
        }
        catch (error) {
            throw new Error(`Failed to add user as admin to tenant: ${error.message}`);
        }
    };

    removeUserAsAdminFromTenant = async (id: uuid, userId: uuid): Promise<boolean> => {
        try {
            var tenantUser = await TenantUser.findOne({ where: { TenantId: id, UserId: userId } });
            if (tenantUser == null) {
                throw new Error(`User is not associated with this tenant!`);
            }
            else {
                tenantUser.Admin = false;
                await tenantUser.save();
                return true;
            }
        }
        catch (error) {
            throw new Error(`Failed to remove user as admin from tenant: ${error.message}`);
        }
    };

    addUserAsModeratorToTenant = async (id: uuid, userId: uuid): Promise<boolean> => {
        try {
            var tenantUser = await TenantUser.findOne({ where: { TenantId: id, UserId: userId } });
            if (tenantUser == null) {
                const entity = {
                    TenantId  : id,
                    UserId    : userId,
                    Moderator : true,
                };
                tenantUser = await TenantUser.create(entity);
                return tenantUser != null;
            }
            else {
                tenantUser.Moderator = true;
                await tenantUser.save();
                return true;
            }
        }
        catch (error) {
            throw new Error(`Failed to add user as moderator to tenant: ${error.message}`);
        }
    };

    removeUserAsModeratorFromTenant = async (id: uuid, userId: uuid): Promise<boolean> => {
        try {
            var tenantUser = await TenantUser.findOne({ where: { TenantId: id, UserId: userId } });
            if (tenantUser == null) {
                throw new Error(`User is not associated with this tenant!`);
            }
            else {
                tenantUser.Moderator = false;
                await tenantUser.save();
                return true;
            }
        }
        catch (error) {
            throw new Error(`Failed to remove user as moderator from tenant: ${error.message}`);
        }
    };

    getTenantStats = async (id: uuid): Promise<any> => {
        try {
            const tenant = await Tenant.findByPk(id);
            if (tenant == null) {
                throw new Error(`Tenant not found!`);
            }
            const tenantUsersCount = await TenantUser.count({ where: { TenantId: id } });
            const adminUsersCount = await TenantUser.count({ where: { TenantId: id, Admin: true } });
            const modUsersCount = await TenantUser.count({ where: { TenantId: id, Moderator: true } });
            const cohortCount = await Cohort.count({ where: { TenantId: id } });

            const stats = {
                TotalUsers   : tenantUsersCount,
                TotalAdmins  : adminUsersCount,
                TotalMods    : modUsersCount,
                TotalCohorts : cohortCount,
            };
            return stats;
        }
        catch (error) {
            throw new Error(`Failed to get tenant stats: ${error.message}`);
        }
    };

    getTenantAdmins = async (id: uuid): Promise<any[]> => {
        try {
            const tenantUsers = await TenantUser.findAll({
                where : {
                    TenantId : id,
                    Admin    : true
                },
                include : [
                    {
                        model    : User,
                        as       : 'User',
                        required : true,
                        include  : [
                            {
                                model    : Person,
                                as       : 'Person',
                                required : true,
                            }
                        ]
                    }
                ]
            });
            const dtos = tenantUsers.map((u) => {
                return {
                    UserId : u.UserId,
                    User   : {
                        id       : u.User.id,
                        UserName : u.User.UserName,
                        Person   : {
                            id                : u.User.Person.id,
                            FirstName         : u.User.Person.FirstName,
                            LastName          : u.User.Person.LastName,
                            Phone             : u.User.Person.Phone,
                            Email             : u.User.Person.Email,
                            ProfilePictureUrl : u.User.Person.ImageResourceId,
                        }
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

    getTenantModerators = async (id: uuid): Promise<any[]> => {
        try {
            const tenantUsers = await TenantUser.findAll({
                where : {
                    TenantId  : id,
                    Moderator : true
                },
                include : [
                    {
                        model    : User,
                        as       : 'User',
                        required : true,
                        include  : [
                            {
                                model    : Person,
                                as       : 'Person',
                                required : true,
                            }
                        ]
                    }
                ]
            });
            const dtos = tenantUsers.map((u) => {
                return {
                    UserId : u.UserId,
                    User   : {
                        id       : u.User.id,
                        UserName : u.User.UserName,
                        Person   : {
                            id                : u.User.Person.id,
                            FirstName         : u.User.Person.FirstName,
                            LastName          : u.User.Person.LastName,
                            Phone             : u.User.Person.Phone,
                            Email             : u.User.Person.Email,
                            ProfilePictureUrl : u.User.Person.ImageResourceId,
                        }
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

}
