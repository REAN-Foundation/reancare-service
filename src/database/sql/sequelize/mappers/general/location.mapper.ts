import { LocationDto } from '../../../../../domain.types/general/location/location.dto';
import Location from '../../../../../database/sql/sequelize/models/general/location.model';


///////////////////////////////////////////////////////////////////////////////////

export class LocationMapper {

    static toDto = (location: Location): LocationDto => {
        if (location == null){
            return null;
        }
    
        const dto: LocationDto = {
            id              : location.id,
            PatientUserId   : location.PatientUserId,
            City            : location.City,
            Longitude       : location.Longitude,
            Lattitude       : location.Lattitude,
            CurrentTimezone : location.CurrentTimezone,
            IsActive        : location.IsActive,
        }
        return dto;
    };

}
