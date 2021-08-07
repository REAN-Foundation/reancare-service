import { IOrganizationRepo } from '../../../repository.interfaces/organization.repo.interface';
import Organization from '../models/organization.model';
import { Op } from 'sequelize';
import {
    OrganizationDomainModel,
    OrganizationDto,
    OrganizationSearchFilters,
    OrganizationSearchResults,
} from '../../../domain.types/organization.domain.types';
import { OrganizationMapper } from '../mappers/organization.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';

///////////////////////////////////////////////////////////////////////

export class OrganizationRepo implements IOrganizationRepo {

    create = async (organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto> => {
        try {
            const entity = {
                Type                             : organizationDomainModel.Type,
                Name                             : organizationDomainModel.Name ?? null,
                ContactUserId                    : organizationDomainModel.ContactUserId ?? null,
                ContactPhone                     : organizationDomainModel.ContactPhone ?? null,
                ContactEmail                     : organizationDomainModel.ContactEmail ?? null,
                ParentOrganizationId             : organizationDomainModel.ParentOrganizationId ?? null,
                About                            : organizationDomainModel.About ?? null,
                OperationalSince                 : organizationDomainModel.OperationalSince ?? null,
                AddressId                        : organizationDomainModel.AddressId ?? null,
                ImageResourceId                  : organizationDomainModel.ImageResourceId ?? null,
                IsHealthFacility                 : organizationDomainModel.IsHealthFacility ?? null,
                NationalHealthFacilityRegistryId : organizationDomainModel.NationalHealthFacilityRegistryId ?? null,
            };
            const organization = await Organization.create(entity);
            const dto = await OrganizationMapper.toDto(organization);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<OrganizationDto> => {
        try {
            const organization = await Organization.findByPk(id);
            const dto = await OrganizationMapper.toDto(organization);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByContactUserId = async (contactUserId: string): Promise<OrganizationDto[]> => {
        try {
            const dtos = [];
            const organizationes = await Organization.findAll({ where: { ContactUserId: contactUserId } });
            for (const organization of organizationes) {
                const dto = await OrganizationMapper.toDto(organization);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: OrganizationSearchFilters): Promise<OrganizationSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.ContactUserId != null) {
                search.where['ContactUserId'] = filters.ContactUserId;
            }
            if (filters.ContactPhone != null) {
                search.where['ContactPhone'] = { [Op.like]: '%' + filters.ContactPhone + '%' };
            }
            if (filters.ContactEmail != null) {
                search.where['ContactEmail'] = { [Op.like]: '%' + filters.ContactEmail + '%' };
            }
            if (filters.OperationalSinceFrom != null && filters.OperationalSinceTo != null) {
                search.where['OperationalSince'] = {
                    [Op.gte] : filters.OperationalSinceFrom,
                    [Op.lte] : filters.OperationalSinceTo,
                };
            }
            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }
            let orderByColum = 'Name';
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

            const foundResults = await Organization.findAndCountAll(search);

            const dtos: OrganizationDto[] = [];
            for (const organization of foundResults.rows) {
                const dto = await OrganizationMapper.toDto(organization);
                dtos.push(dto);
            }

            const searchResults: OrganizationSearchResults = {
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

    update = async (id: string, organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto> => {
        try {
            const organization = await Organization.findByPk(id);

            if (organizationDomainModel.Type != null) {
                organization.Type = organizationDomainModel.Type;
            }
            if (organizationDomainModel.Name != null) {
                organization.Name = organizationDomainModel.Name;
            }
            if (organizationDomainModel.ContactUserId != null) {
                organization.ContactUserId = organizationDomainModel.ContactUserId;
            }
            if (organizationDomainModel.ContactPhone != null) {
                organization.ContactPhone = organizationDomainModel.ContactPhone;
            }
            if (organizationDomainModel.ContactEmail != null) {
                organization.ContactEmail = organizationDomainModel.ContactEmail;
            }
            if (organizationDomainModel.ParentOrganizationId != null) {
                organization.ParentOrganizationId = organizationDomainModel.ParentOrganizationId;
            }
            if (organizationDomainModel.About != null) {
                organization.About = organizationDomainModel.About;
            }
            if (organizationDomainModel.OperationalSince != null) {
                organization.OperationalSince = organizationDomainModel.OperationalSince;
            }
            if (organizationDomainModel.AddressId != null) {
                organization.AddressId = organizationDomainModel.AddressId;
            }
            if (organizationDomainModel.ImageResourceId != null) {
                organization.ImageResourceId = organizationDomainModel.ImageResourceId;
            }
            if (organizationDomainModel.IsHealthFacility != null) {
                organization.IsHealthFacility = organizationDomainModel.IsHealthFacility;
            }
            if (organizationDomainModel.NationalHealthFacilityRegistryId != null) {
                organization.NationalHealthFacilityRegistryId =
                    organizationDomainModel.NationalHealthFacilityRegistryId;
            }
            await organization.save();

            const dto = await OrganizationMapper.toDto(organization);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Organization.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
