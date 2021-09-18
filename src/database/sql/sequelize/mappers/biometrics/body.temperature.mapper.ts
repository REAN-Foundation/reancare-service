import BodyTemperatureModel from '../../models/biometrics/body.temperature.model';
import { BodyTemperatureDto } from '../../../../../domain.types/biometrics/body.temperature/body.temperature.dto';

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
            BodyTemperature  : bodyTemperature.BodyTemperature,
            Unit             : bodyTemperature.Unit,
            RecordDate       : bodyTemperature.RecordDate,
            RecordedByUserId : bodyTemperature.RecordedByUserId
        };
        return dto;
    }

}
