import { ILocationRepo } from '../../../../../database/repository.interfaces/general/location.repo.interface';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { LocationDomainModel } from '../../../../../domain.types/general/location/location.domain.model';
import { LocationDto } from '../../../../../domain.types/general/location/location.dto';
import Location from '../../../../../database/sql/sequelize/models/general/location.model';
import { LocationMapper } from '../../mappers/general/location.mapper';
import { isNullOrUndefined } from 'util';

///////////////////////////////////////////////////////////////////////

export class LocationRepo implements ILocationRepo {

    create = async (locationDomainModel: LocationDomainModel): Promise<LocationDto> => {
        try {
            const entity = {
                PatientUserId   : locationDomainModel.PatientUserId,
                City            : locationDomainModel.City ?? null,
                Longitude       : locationDomainModel.Longitude ?? null,
                Lattitude       : locationDomainModel.Lattitude ?? null,
                CurrentTimezone : locationDomainModel.CurrentTimezone ?? null,
                IsActive        : locationDomainModel.IsActive ?? null,

            };
            const location = await Location.create(entity);
            const dto = await LocationMapper.toDto(location);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getExistingRecord = async (locationDetails: any): Promise<LocationDto> => {
        try {

            const existingRecord =  await Location.findOne({
                where : {
                    PatientUserId   : locationDetails.PatientUserId,
                    City            : locationDetails.City,
                    CurrentTimezone : locationDetails.CurrentTimezone,

                }
            });
            return await LocationMapper.toDto(existingRecord);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    invalidateExistingRecords = async (patientUserId: string): Promise<boolean> => {
        try {

            const updated =  await Location.update(
                { IsActive : false },
                {
                where : {
                    PatientUserId   : patientUserId,
                    IsActive : true
                }
            });
            return updated.length > 0 ? true : false;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
