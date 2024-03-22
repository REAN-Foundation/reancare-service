import { LocationDomainModel } from "../../domain.types/general/location/location.domain.model";
import { LocationDto } from "../../domain.types/general/location/location.dto";
import { inject, injectable } from "tsyringe";
import { ILocationRepo } from "../../database/repository.interfaces/general/location.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class LocationService {

    constructor(
        @inject('ILocationRepo') private _locationRepo: ILocationRepo,
    ) {}

    create = async (locationDomainModel: LocationDomainModel): Promise<LocationDto> => {
        return await this._locationRepo.create(locationDomainModel);
    };

    getExistingRecord = async (locationDetails: any): Promise<LocationDto> => {
        return await this._locationRepo.getExistingRecord(locationDetails);
    };

    invalidateExistingRecords = async (patientUserId: string): Promise<boolean> => {
        return await this._locationRepo.invalidateExistingRecords(patientUserId);
    };


}
