import { IRoleRepo } from '../../../../repository.interfaces/role/role.repo.interface';
import Role from '../../models/role/role.model';
import { Op } from 'sequelize';
import { RoleDto } from '../../../../../domain.types/role/role.dto';
import { RoleMapper } from '../../mappers/role/role.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { RoleDomainModel } from '../../../../../domain.types/role/role.domain.model';
import { RoleSearchFilters, RoleSearchResults } from '../../../../../domain.types/role/role.search.types';

///////////////////////////////////////////////////////////////////////

export class RoleRepo implements IRoleRepo {

    create = async (roleEntity: any): Promise<RoleDto> => {
        try {
            const entity = {
                RoleName      : roleEntity.RoleName,
                Description   : roleEntity.Description ?? null,
                TenantId      : roleEntity.TenantId ?? null,
                ParentRoleId  : roleEntity.ParentRoleId ?? null,
                IsSystemRole  : roleEntity.IsSystemRole ?? false,
                IsUserRole    : roleEntity.IsUserRole ?? false,
                IsDefaultRole : roleEntity.IsDefaultRole ?? false,
            };
            const role = await Role.create(entity);
            const dto = RoleMapper.toDto(role);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: number): Promise<RoleDto> => {
        try {
            const role = await Role.findByPk(id);
            const dto = await RoleMapper.toDto(role);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByName = async (name: string): Promise<RoleDto> => {
        try {
            const role = await Role.findOne({ where: { RoleName: { [Op.like]: '%' + name + '%' } } });
            const dto = await RoleMapper.toDto(role);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: number): Promise<boolean> => {
        try {
            await Role.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    searchByName = async (name?: string): Promise<RoleDto[]> => {
        try {
            let filter = { where: {} };
            if (name != null && name !== 'undefined') {
                filter = {
                    where : {
                        RoleName : { [Op.like]: '%' + name + '%' },
                    },
                };
            }
            const roles = await Role.findAll(filter);
            const dtos = roles.map((x) => {
                return RoleMapper.toDto(x);
            });
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: RoleSearchFilters): Promise<RoleSearchResults> => {
        try {
            const search = { where: {} };
            if (filters.RoleName != null) {
                search.where['RoleName'] = { [Op.like]: '%' + filters.RoleName + '%' };
            }

            if (filters.TenantId != null) {
                search.where['TenantId'] = filters.TenantId;
            }
            if (filters.ParentRoleId) {
                search.where['ParentRoleId'] = filters.ParentRoleId;
            }
            if (filters.IsSystemRole) {
                search.where['IsSystemRole'] = filters.IsSystemRole;
            }
            if (filters.IsUserRole) {
                search.where['IsUserRole'] = filters.IsUserRole;
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
            
            const foundResults = await Role.findAndCountAll(search);
            const dtos = foundResults.rows.map(x => RoleMapper.toDto(x));
            const searchResult: RoleSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResult;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: number, roleDomainModel: RoleDomainModel): Promise<RoleDto> => {
        try {
            const role = await Role.findOne({ where: { id: id } });

            if (roleDomainModel.RoleName != null) {
                role.RoleName = roleDomainModel.RoleName;
            }
            if (roleDomainModel.Description != null) {
                role.Description = roleDomainModel.Description;
            }
            if (roleDomainModel.TenantId != null) {
                role.TenantId = roleDomainModel.TenantId;
            }
            if (roleDomainModel.ParentRoleId != null) {
                role.ParentRoleId = roleDomainModel.ParentRoleId;
            }
            if (roleDomainModel.IsSystemRole != null) {
                role.IsSystemRole = roleDomainModel.IsSystemRole;
            }
            if (roleDomainModel.IsUserRole != null) {
                role.IsUserRole = roleDomainModel.IsUserRole;
            }

            await role.save();

            const dto = await RoleMapper.toDto(role);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
