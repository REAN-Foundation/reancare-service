import { BodyTemperatureDto } from '../../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto';
import BodyTemperatureModel from '../../../models/clinical/biometrics/body.temperature.model';

///////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureMapper {

    static toDto = (
        bodyTemperature: BodyTemperatureModel): BodyTemperatureDto => {
        if (bodyTemperature == null) {
            return null;
        }
        const dto: BodyTemperatureDto = {
            id               : bodyTemperature.id,
            EhrId            : bodyTemperature.EhrId,
            PatientUserId    : bodyTemperature.PatientUserId,
            TerraSummaryId   : bodyTemperature.TerraSummaryId,
            Provider         : bodyTemperature.Provider,
            BodyTemperature  : bodyTemperature.BodyTemperature,
            Unit             : bodyTemperature.Unit,
            RecordDate       : bodyTemperature.RecordDate,
            RecordedByUserId : bodyTemperature.RecordedByUserId
        };
        return dto;
    };

}
