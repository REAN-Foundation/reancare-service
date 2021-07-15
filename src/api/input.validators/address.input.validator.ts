import { Helper } from '../../common/helper';
import { AddressDomainModel } from '../../data/domain.types/address.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AddressInputValidator {

    static getDomainModel = async (addressBody: any): Promise<AddressDomainModel> => {

        var addressModel: AddressDomainModel = null;
        var address = Helper.checkObj(addressBody);
        if (address != null) {
            addressModel = {
                Type: 'Home',
                AddressLine: addressBody.Address.AddressLine ?? null,
                City: addressBody.Address.City ?? null,
                District: addressBody.Address.District ?? null,
                State: addressBody.Address.State ?? null,
                Country: addressBody.Address.Country ?? null,
                PostalCode: addressBody.Address.PostalCode ?? null,
                LocationCoordsLongitude: addressBody.Address.LocationCoordsLongitude ?? null,
                LocationCoordsLattitude: addressBody.Address.LocationCoordsLattitude ?? null,
            };
        }
        
        return addressModel;
    };
}