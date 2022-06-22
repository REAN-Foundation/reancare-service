import { FoodComponentDto } from '../../../../../../domain.types/wellness/food.component.monitoring/food.component.dto';
import FoodComponentModel from '../../../models/wellness/food.component.monitoring/food.component.model';

///////////////////////////////////////////////////////////////////////////////////

export class FoodComponentMapper {

    static toDto = (
        foodComponent: FoodComponentModel): FoodComponentDto => {
        if (foodComponent == null) {
            return null;
        }
        const dto: FoodComponentDto = {
            id           : foodComponent.id,
            EhrId        : foodComponent.EhrId,
            PatientUserId: foodComponent.PatientUserId,
            TypeOfFood   : foodComponent.TypeOfFood,
            Amount       : foodComponent.Amount,
            Unit         : foodComponent.Unit,

        };
        return dto;
    };

}
