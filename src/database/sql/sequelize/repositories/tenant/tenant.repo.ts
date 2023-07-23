import Tenant from '../../models/tenant/tenant.model';
import { TenantDto } from '../../../../../domain.types/tenant/tenant.dto';
import { TenantSearchFilters, TenantSearchResults } from '../../../../../domain.types/tenant/tenant.search.types';
import { TenantDomainModel } from '../../../../../domain.types/tenant/tenant.domain.model';
import { ITenantRepo } from '../../../../../database/repository.interfaces/tenant/tenant.repo.interface';
import { TenantMapper } from '../../mappers/tenant/tenant.mapper';
import { Op } from 'sequelize';
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
            throw new Error(`Failed to create tenant: ${error.message}`);
        }
    };

    getById = async (id: string): Promise<TenantDto> => {
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

    exists = async (id: string): Promise<boolean> => {
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

    update = async (id: string, model: TenantDomainModel): Promise<TenantDto> => {
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

}
