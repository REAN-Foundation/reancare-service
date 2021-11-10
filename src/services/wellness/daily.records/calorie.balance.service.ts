import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ICalorieBalanceRepo } from "../../../database/repository.interfaces/wellness/daily.records/calorie.balance.repo.interface";
import { CalorieBalanceDomainModel } from '../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.domain.model';
import { CalorieBalanceDto } from '../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.dto';
import { CalorieBalanceSearchFilters, CalorieBalanceSearchResults } from '../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CalorieBalanceService {

    constructor(
        @inject('ICalorieBalanceRepo') private _calorieBalanceRepo: ICalorieBalanceRepo,
    ) {}

    create = async (calorieBalanceDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto> => {
        return await this._calorieBalanceRepo.create(calorieBalanceDomainModel);
    };

    getById = async (id: uuid): Promise<CalorieBalanceDto> => {
        return await this._calorieBalanceRepo.getById(id);
    };

    search = async (filters: CalorieBalanceSearchFilters): Promise<CalorieBalanceSearchResults> => {
        return await this._calorieBalanceRepo.search(filters);
    };

    update = async (id: uuid, calorieBalanceDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto> => {
        return await this._calorieBalanceRepo.update(id, calorieBalanceDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._calorieBalanceRepo.delete(id);
    };

}
