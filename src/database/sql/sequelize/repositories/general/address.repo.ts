import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { AddressDomainModel } from '../../../../../domain.types/general/address/address.domain.model';
import { AddressDto } from '../../../../../domain.types/general/address/address.dto';
import { AddressSearchFilters, AddressSearchResults } from '../../../../../domain.types/general/address/address.search.types';
import { IAddressRepo } from '../../../../repository.interfaces/general/address.repo.interface';
import { AddressMapper } from '../../mappers/general/address.mapper';
import Address from '../../models/general/address.model';
import OrganizationAddresses from '../../models/general/organization/organization.addresses.model';

///////////////////////////////////////////////////////////////////////

export class AddressRepo implements IAddressRepo {

    create = async (addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        try {
            const entity = {
                Type        : addressDomainModel.Type,
                AddressLine : addressDomainModel.AddressLine ?? null,
                City        : addressDomainModel.City ?? null,
                District    : addressDomainModel.District ?? null,
                State       : addressDomainModel.State ?? null,
                Country     : addressDomainModel.Country ?? null,
                PostalCode  : addressDomainModel.PostalCode ?? null,
                Longitude   : addressDomainModel.Longitude ?? null,
                Lattitude   : addressDomainModel.Lattitude ?? null,
                Location    : addressDomainModel.Location ?? null,
            };
            const address = await Address.create(entity);
            const dto = await AddressMapper.toDto(address);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<AddressDto> => {
        try {
            const address = await Address.findByPk(id);
            const dto = await AddressMapper.toDto(address);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: AddressSearchFilters): Promise<AddressSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.AddressLine != null) {
                search.where['AddressLine'] = { [Op.like]: '%' + filters.AddressLine + '%' };
            }
            if (filters.City != null) {
                search.where['City'] = { [Op.like]: '%' + filters.City + '%' };
            }
            if (filters.District != null) {
                search.where['District'] = { [Op.like]: '%' + filters.District + '%' };
            }
            if (filters.State != null) {
                search.where['State'] = { [Op.like]: '%' + filters.State + '%' };
            }
            if (filters.Country != null) {
                search.where['Country'] = { [Op.like]: '%' + filters.Country + '%' };
            }
            if (filters.Country != null) {
                search.where['Location'] = { [Op.like]: '%' + filters.Location + '%' };
            }
            if (filters.PostalCode != null) {
                search.where['PostalCode'] = { [Op.like]: '%' + filters.PostalCode + '%' };
            }
            if (filters.LongitudeFrom != null && filters.LongitudeTo != null) {
                search.where['Longitude'] = {
                    [Op.gte] : filters.LongitudeFrom,
                    [Op.lte] : filters.LongitudeTo,
                };
            }
            if (filters.LattitudeFrom != null && filters.LattitudeTo != null) {
                search.where['Lattitude'] = {
                    [Op.gte] : filters.LattitudeFrom,
                    [Op.lte] : filters.LattitudeTo,
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
            if (filters.PostalCode !== null) {
                search.where['PostalCode'] = { [Op.like]: '%' + filters.PostalCode + '%' };
            }

            let orderByColum = 'AddressLine';
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

            const foundResults = await Address.findAndCountAll(search);

            const dtos: AddressDto[] = [];
            for (const address of foundResults.rows) {
                const dto = await AddressMapper.toDto(address);
                dtos.push(dto);
            }

            const searchResults: AddressSearchResults = {
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

    update = async (id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        try {
            const address = await Address.findByPk(id);

            if (addressDomainModel.Type !== undefined &&
                addressDomainModel.Type !== null) {
                address.Type = addressDomainModel.Type;
            }
            if (addressDomainModel.AddressLine !== undefined &&
                addressDomainModel.AddressLine !== null) {
                address.AddressLine = addressDomainModel.AddressLine;
            }
            if (addressDomainModel.City !== undefined) {
                address.City = addressDomainModel.City;
            }
            if (addressDomainModel.District !== undefined) {
                address.District = addressDomainModel.District;
            }
            if (addressDomainModel.State !== undefined) {
                address.State = addressDomainModel.State;
            }
            if (addressDomainModel.Country !== undefined) {
                address.Country = addressDomainModel.Country;
            }
            if (addressDomainModel.Location !== undefined) {
                address.Location = addressDomainModel.Location;
            }
            if (addressDomainModel.PostalCode !== undefined) {
                address.PostalCode = addressDomainModel.PostalCode;
            }
            if (addressDomainModel.Longitude !== undefined) {
                address.Longitude = addressDomainModel.Longitude;
            }
            if (addressDomainModel.Lattitude !== undefined) {
                address.Lattitude = addressDomainModel.Lattitude;
            }
            await address.save();

            const dto = await AddressMapper.toDto(address);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Address.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAddressesForOrganization = async (organizationId: string): Promise<AddressDto[]> => {
        try {
            const organizationAddresses = await OrganizationAddresses.findAll({ where   : { OrganizationId: organizationId },
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

}
