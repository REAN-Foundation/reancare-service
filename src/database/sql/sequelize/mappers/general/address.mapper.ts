import Address from '../../models/general/address.model';
import { AddressDto } from '../../../../../domain.types/general/address/address.dto';

///////////////////////////////////////////////////////////////////////////////////

export class AddressMapper {

    static toDto = (address: Address): AddressDto => {
        if (address == null){
            return null;
        }
        const longitude: string = address.Longitude ? address.Longitude.toString() : null;
        const lattitude: string = address.Lattitude ? address.Lattitude.toString() : null;

        const dto: AddressDto = {
            id          : address.id,
            Type        : address.Type,
            AddressLine : address.AddressLine,
            City        : address.City,
            District    : address.District,
            State       : address.State,
            Location    : address.Location,
            Country     : address.Country,
            PostalCode  : address.PostalCode,
            Longitude   : longitude ? parseFloat(longitude) : null,
            Lattitude   : lattitude ? parseFloat(lattitude) : null,
        };
        return dto;
    };

}
