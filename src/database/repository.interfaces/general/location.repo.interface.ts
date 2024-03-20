import { LocationDomainModel } from "../../../domain.types/general/location/location.domain.model";
import { LocationDto } from "../../../domain.types/general/location/location.dto";

export interface ILocationRepo {

    create(locationDomainModel: LocationDomainModel): Promise<LocationDto>;

    getExistingRecord(locationDetails: any): Promise<LocationDto>;

    invalidateExistingRecords(patientUserId: string): Promise<boolean>;
    
}
