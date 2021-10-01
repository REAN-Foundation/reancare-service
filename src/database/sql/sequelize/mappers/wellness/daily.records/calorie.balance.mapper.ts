import { CalorieBalanceDto } from '../../../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.dto';
import CalorieBalance from '../../../models/wellness/daily.records/calorie.balance.model';

///////////////////////////////////////////////////////////////////////////////////

export class CalorieBalanceMapper {

    static toDto = (calorieBalance: CalorieBalance): CalorieBalanceDto => {
        if (calorieBalance == null){
            return null;
        }

        const dto: CalorieBalanceDto = {
            id               : calorieBalance.id,
            PersonId         : calorieBalance.PersonId,
            PatientUserId    : calorieBalance.PatientUserId,
            CaloriesBurned   : calorieBalance.CaloriesBurned,
            CaloriesConsumed : calorieBalance.CaloriesConsumed,
            Unit             : calorieBalance.Unit,
            Person           : undefined,
            CalorieBalance   : Number(calorieBalance.CaloriesConsumed) - Number(calorieBalance.CaloriesBurned)
        };
        return dto;
    }

}
