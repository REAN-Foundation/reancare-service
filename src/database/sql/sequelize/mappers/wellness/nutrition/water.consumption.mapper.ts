import { WaterConsumptionDto } from '../../../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.dto';
import WaterConsumptionModel from '../../../models/wellness/nutrition/water.consumption.model';

///////////////////////////////////////////////////////////////////////////////////

export class WaterConsumptionMapper {

    static toDto = (
        waterConsumption: WaterConsumptionModel): WaterConsumptionDto => {
        if (waterConsumption == null) {
            return null;
        }
        const dto: WaterConsumptionDto = {
            id             : waterConsumption.id,
            EhrId          : waterConsumption.EhrId,
            PatientUserId  : waterConsumption.PatientUserId,
            TerraSummaryId : waterConsumption.TerraSummaryId,
            Provider       : waterConsumption.Provider,
            Volume         : waterConsumption.Volume,
            Time           : waterConsumption.Time,
        };
        return dto;
    };

}
