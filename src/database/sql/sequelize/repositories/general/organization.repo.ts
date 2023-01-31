import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { AddressDto } from '../../../../../domain.types/general/address/address.dto';
import { OrganizationDomainModel } from '../../../../../domain.types/general/organization/organization.domain.model';
import { OrganizationDto } from '../../../../../domain.types/general/organization/organization.dto';
import { OrganizationSearchFilters, OrganizationSearchResults } from '../../../../../domain.types/general/organization/organization.search.types';
import { PersonDto } from '../../../../../domain.types/person/person.dto';
import { IOrganizationRepo } from '../../../../repository.interfaces/general/organization.repo.interface';
import { AddressMapper } from '../../mappers/general/address.mapper';
import { OrganizationMapper } from '../../mappers/general/organization.mapper';
import { PersonMapper } from '../../mappers/person/person.mapper';
import Address from '../../models/general/address.model';
import OrganizationAddresses from '../../models/general/organization/organization.addresses.model';
import Organization from '../../models/general/organization/organization.model';
import OrganizationPersons from '../../models/general/organization/organization.persons.model';
import Person from '../../models/person/person.model';

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

            var parentOrganization = null;
            if (organization.ParentOrganizationId != null) {
                parentOrganization = await Organization.findByPk(organization.ParentOrganizationId);
            }

            const dto = OrganizationMapper.toDto(organization, parentOrganization);
            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private addAddresses = async (organizationId, addressIds) => {
        if (addressIds !== null && addressIds.length > 0) {
            for await (var addressId of addressIds) {
                await this.addAddress(organizationId, addressId);
            }
        }
    };

    getById = async (id: string): Promise<OrganizationDto> => {
        try {
            const organization = await Organization.findByPk(id);
            if (organization === null) {
                return null;
            }
            var parentOrganization = null;
            if (organization.ParentOrganizationId != null) {
                parentOrganization = await Organization.findByPk(organization.ParentOrganizationId);
            }

            const dto = OrganizationMapper.toDto(organization, parentOrganization);
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
                const dto = OrganizationMapper.toDto(organization);
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
                const dto = OrganizationMapper.toDto(organization);
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

            var parentOrganization = null;
            if (organization.ParentOrganizationId != null) {
                parentOrganization = await Organization.findByPk(organization.ParentOrganizationId);
            }

            const dto = OrganizationMapper.toDto(organization, parentOrganization);
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

    addAddress = async (id: string, addressId: string): Promise<boolean> => {
        try {
            const organizationAddresses = await OrganizationAddresses.findAll({
                where : {
                    AddressId      : addressId,
                    OrganizationId : id
                }
            });
            if (organizationAddresses.length > 0) {
                return false;
            }
            var entity = await OrganizationAddresses.create({
                AddressId      : addressId,
                OrganizationId : id
            });
            return entity != null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    removeAddress = async (id: string, addressId: string): Promise<boolean> => {
        try {
            var result = await OrganizationAddresses.destroy({
                where : {
                    AddressId      : addressId,
                    OrganizationId : id
                }
            });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAddresses = async (id: string): Promise<AddressDto[]> => {

        try {
            const organizationAddresses = await OrganizationAddresses.findAll({
                where : {
                    OrganizationId : id
                },
                include : [
                    {
                        model : Address
                    }
                ]
            });
            var list = organizationAddresses.map(x => x.Address);
            return list.map(y => AddressMapper.toDto(y));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addPerson = async (id: string, personId: string): Promise<boolean> => {

        try {
            const organizationPersons = await OrganizationPersons.findAll({
                where : {
                    OrganizationId : id,
                    PersonId       : personId
                }
            });
            if (organizationPersons.length > 0) {
                return true;
            }
            var op = await OrganizationPersons.create({
                OrganizationId : id,
                PersonId       : personId
            });
            if (op != null) {
                return true;
            }
            return false;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    removePerson = async (id: string, personId: string): Promise<boolean> => {

        const result = await OrganizationPersons.destroy({
            where : {
                OrganizationId : id,
                PersonId       : personId
            }
        });

        return result > 0;
    };

    getPersons = async (id: string): Promise<PersonDto[]> => {

        try {
            const organizationPersons = await OrganizationPersons.findAll({
                where : {
                    OrganizationId : id
                },
                include : [
                    {
                        model : Person
                    }
                ]
            });
            var list = organizationPersons.map(x => x.Person);
            return list.map(y => PersonMapper.toDto(y));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
