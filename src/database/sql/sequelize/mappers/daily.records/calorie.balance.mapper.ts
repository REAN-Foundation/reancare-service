import CalorieBalance from '../../models/daily.records/calorie.balance.model';
import { CalorieBalanceDto } from '../../../../../domain.types/daily.records/calorie.balance/calorie.balance.dto';

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
