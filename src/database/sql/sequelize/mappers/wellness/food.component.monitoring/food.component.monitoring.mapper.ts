import { FoodComponentMonitoringTypes } from '../../../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.types';
import { FoodComponentMonitoringDto } from '../../../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.dto';
import FoodComponentMonitoringModel from '../../../models/wellness/food.component.monitoring/food.component.monitoring.model';

///////////////////////////////////////////////////////////////////////////////////

export class FoodComponentMonitoringMapper {

    static toDto = (
        foodComponentMonitoring: FoodComponentMonitoringModel): FoodComponentMonitoringDto => {
        if (foodComponentMonitoring == null) {
            return null;
        }
        const dto: FoodComponentMonitoringDto = {
            id                     : foodComponentMonitoring.id,
            EhrId                  : foodComponentMonitoring.EhrId,
            PatientUserId          : foodComponentMonitoring.PatientUserId,
            MonitoredFoodComponent : foodComponentMonitoring.MonitoredFoodComponent as FoodComponentMonitoringTypes,
            Amount                 : foodComponentMonitoring.Amount,
            Unit                   : foodComponentMonitoring.Unit,

        };
        return dto;
    };

}
