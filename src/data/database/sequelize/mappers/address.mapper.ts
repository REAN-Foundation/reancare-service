import { Address } from '../models/address.model';
import { AddressDto } from "../../../domain.types/address.domain.types";

///////////////////////////////////////////////////////////////////////////////////

export class AddressMapper {

    static toDto = (address: Address): AddressDto => {
        if(address == null){
            return null;
        }
        var dto: AddressDto = {
            id: address.id,
            Type: address.Type,
            UserId: address.UserId,
            OrganizationId: address.OrganizationId,
            AddressLine: address.AddressLine,
            City: address.City,
            District: address.District,
            State: address.State,
            Country: address.Country,
            PostalCode: address.PostalCode,
            LocationCoordsLongitude: address.LocationCoordsLongitude,
            LocationCoordsLattitude: address.LocationCoordsLattitude,
        };
        return dto;
    }

}

