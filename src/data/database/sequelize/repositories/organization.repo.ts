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
import Address from '../models/address.model';
import OrganizationPersons from '../models/organization.persons.model';

///////////////////////////////////////////////////////////////////////

export class OrganizationRepo implements IOrganizationRepo {

    create = async (model: OrganizationDomainModel): Promise<OrganizationDto> => {
        try {
            const entity = {
                Type                             : model.Type,
                Name                             : model.Name ?? null,
                ContactUserId                    : model.ContactUserId ?? null,
                ContactPhone                     : model.ContactPhone ?? null,
                ContactEmail                     : model.ContactEmail ?? null,
                ParentOrganizationId             : model.ParentOrganizationId ?? null,
                About                            : model.About ?? null,
                OperationalSince                 : model.OperationalSince ?? null,
                ImageResourceId                  : model.ImageResourceId ?? null,
                IsHealthFacility                 : model.IsHealthFacility ?? null,
                NationalHealthFacilityRegistryId : model.NationalHealthFacilityRegistryId ?? null,
            };
            const organization = await Organization.create(entity);
            await this.addAddresses(organization.id, model.AddressIds);

            const dto = await OrganizationMapper.toDto(organization);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private addAddresses = async (organizationId, addressIds) => {
        if (addressIds !== null && addressIds.length > 0) {
            for await (var addressId of addressIds) {
                var address = await Address.findByPk(addressId);
                if (address === null) {
                    continue;
                }
                address.OrganizationId = organizationId;
                await address.save();
            }
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
            const organizations = await Organization.findAll({
                where : { ContactUserId: contactUserId },
            });
            for (const organization of organizations) {
                const dto = await OrganizationMapper.toDto(organization);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByPersonId = async (personId: string): Promise<OrganizationDto[]> => {
        try {
            const dtos = [];
            const organizationPersons = await OrganizationPersons.findAll({
                where   : { PersonId: personId },
                include : [
                    {
                        model : Organization
                    }
                ]
            });
            var organizations = organizationPersons.map(x => x.Organization);
            for (const organization of organizations) {
                const dto = await OrganizationMapper.toDto(organization);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

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
                search.where['ContactPhone'] = {
                    [Op.like] : '%' + filters.ContactPhone + '%',
                };
            }
            if (filters.ContactEmail != null) {
                search.where['ContactEmail'] = {
                    [Op.like] : '%' + filters.ContactEmail + '%',
                };
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

    update = async (id: string, model: OrganizationDomainModel): Promise<OrganizationDto> => {
        try {
            const organization = await Organization.findByPk(id);

            if (model.Type != null) {
                organization.Type = model.Type;
            }
            if (model.Name != null) {
                organization.Name = model.Name;
            }
            if (model.ContactUserId != null) {
                organization.ContactUserId = model.ContactUserId;
            }
            if (model.ContactPhone != null) {
                organization.ContactPhone = model.ContactPhone;
            }
            if (model.ContactEmail != null) {
                organization.ContactEmail = model.ContactEmail;
            }
            if (model.ParentOrganizationId != null) {
                organization.ParentOrganizationId = model.ParentOrganizationId;
            }
            if (model.About != null) {
                organization.About = model.About;
            }
            if (model.OperationalSince != null) {
                organization.OperationalSince = model.OperationalSince;
            }
            if (model.ImageResourceId != null) {
                organization.ImageResourceId = model.ImageResourceId;
            }
            if (model.IsHealthFacility != null) {
                organization.IsHealthFacility = model.IsHealthFacility;
            }
            if (model.NationalHealthFacilityRegistryId != null) {
                organization.NationalHealthFacilityRegistryId = model.NationalHealthFacilityRegistryId;
            }
            await organization.save();

            await this.addAddresses(organization.id, model.AddressIds);

            const dto = await OrganizationMapper.toDto(organization);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addAddress = async (id: string, addressId: string): Promise<boolean> => {
        var address = await Address.findByPk(addressId);
        if (address === null) {
            return false;
        }
        var organization = await Organization.findByPk(id);
        if (organization === null) {
            return false;
        }
        address.OrganizationId = id;
        await address.save();

        return true;
    };

    removeAddress = async (id: string, addressId: string): Promise<boolean> => {
        var address = await Address.findByPk(addressId);
        if (address === null) {
            return false;
        }
        var organization = await Organization.findByPk(id);
        if (organization === null) {
            return false;
        }
        if (address.OrganizationId !== organization.id) {
            return false;
        }
        address.OrganizationId = null;
        await address.save();

        return true;
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
