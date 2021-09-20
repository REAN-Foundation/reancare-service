import FileResource from '../models/file.resource/file.resource.model';
import { FileResourceDto } from '../../../../domain.types/file.resource/file.resource.dto';

///////////////////////////////////////////////////////////////////////////////////

export class FileResourceMapper {

    static toDto = (fileResource: FileResource): FileResourceDto => {
        if (fileResource == null){
            return null;
        }

        const dto: fileResourceDto = {
            id          : address.id,
            Type        : address.Type,
            AddressLine : address.AddressLine,
            City        : address.City,
            District    : address.District,
            State       : address.State,
            Country     : address.Country,
            PostalCode  : address.PostalCode,
            Longitude   : longitude ? parseFloat(longitude) : null,
            Lattitude   : lattitude ? parseFloat(lattitude) : null,
        };
        return dto;
    }

}
