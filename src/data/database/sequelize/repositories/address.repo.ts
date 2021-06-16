import { IAddressRepo } from '../../../repository.interfaces/address.repo.interface';
import { Address } from '../models/address.model';
import { Op, Sequelize } from 'sequelize/types';
import { AddressDomainModel, AddressDto } from '../../../domain.types/address.domain.types';
import { AddressMapper } from '../mappers/address.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';

///////////////////////////////////////////////////////////////////////

export class AddressRepo implements IAddressRepo {
    
    create = async (addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        try {
            var entity = {
                Type: addressDomainModel.Type,
                UserId: addressDomainModel.UserId ?? null,
                OrganizationId: addressDomainModel.OrganizationId ?? null,
                AddressLine: addressDomainModel.AddressLine ?? null,
                City: addressDomainModel.City ?? null,
                District: addressDomainModel.District ?? null,
                State: addressDomainModel.State ?? null,
                Country: addressDomainModel.Country ?? null,
                PostalCode: addressDomainModel.PostalCode ?? null,
                LocationCoordsLongitude: addressDomainModel.LocationCoordsLongitude ?? null,
                LocationCoordsLattitude: addressDomainModel.LocationCoordsLattitude ?? null,
            };
            var address = await Address.create(entity);
            var dto = await AddressMapper.toDto(address);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<AddressDto> => {
        try {
            var address = await Address.findByPk(id);
            var dto = await AddressMapper.toDto(address);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (userId: string): Promise<AddressDto> => {
        try {
            var address = await Address.findOne({where:{userId: userId}});
            var dto = await AddressMapper.toDto(address);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        try {
            var address = await Address.findByPk(id);

            if(addressDomainModel.Type != null) {
                address.Type = addressDomainModel.Type;
            }
            if(addressDomainModel.UserId != null) {
                address.UserId = addressDomainModel.UserId;
            }
            if(addressDomainModel.OrganizationId != null) {
                address.OrganizationId = addressDomainModel.OrganizationId;
            }
            if(addressDomainModel.AddressLine != null) {
                address.AddressLine = addressDomainModel.AddressLine;
            }
            if(addressDomainModel.City != null) {
                address.City = addressDomainModel.City;
            }
            if(addressDomainModel.District != null) {
                address.District = addressDomainModel.District;
            }
            if(addressDomainModel.State != null) {
                address.State = addressDomainModel.State;
            }
            if(addressDomainModel.Country != null) {
                address.Country = addressDomainModel.Country;
            }
            if(addressDomainModel.PostalCode != null) {
                address.PostalCode = addressDomainModel.PostalCode;
            }
            if(addressDomainModel.LocationCoordsLongitude != null) {
                address.LocationCoordsLongitude = addressDomainModel.LocationCoordsLongitude;
            }
            if(addressDomainModel.LocationCoordsLattitude != null) {
                address.LocationCoordsLattitude = addressDomainModel.LocationCoordsLattitude;
            }
            await address.save();

            var dto = await AddressMapper.toDto(address);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    delete = async (id: string): Promise<boolean> => {
        try {
            await Address.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
