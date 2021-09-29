import WaterConsumptionModel from '../../models/nutrition/water.consumption.model';
import { WaterConsumptionDto } from '../../../../../domain.types/nutrition/water.consumption/water.consumption.dto';

///////////////////////////////////////////////////////////////////////////////////

export class WaterConsumptionMapper {

    static toDto = (
        waterConsumption: WaterConsumptionModel): WaterConsumptionDto => {
        if (waterConsumption == null) {
            return null;
        }
        const dto: WaterConsumptionDto = {
            id            : waterConsumption.id,
            EhrId         : waterConsumption.EhrId,
            PatientUserId : waterConsumption.PatientUserId,
            Volume        : waterConsumption.Volume,
            Time          : waterConsumption.Time,
        };
        return dto;
    }

}
