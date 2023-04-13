import { CalorieBalanceDomainModel } from "../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.domain.model";
import { CalorieBalanceDto } from "../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.dto";
import { CalorieBalanceSearchFilters, CalorieBalanceSearchResults } from "../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.search.types";

export interface ICalorieBalanceRepo {

    create(calorieBalanceDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto>;

    getById(id: string): Promise<CalorieBalanceDto>;

    search(filters: CalorieBalanceSearchFilters): Promise<CalorieBalanceSearchResults>;

    update(id: string, calorieBalanceDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto>;

    delete(id: string): Promise<boolean>;

    getByRecordDate(recordDate: Date, patientUserId : string): Promise<CalorieBalanceDto>;

}
