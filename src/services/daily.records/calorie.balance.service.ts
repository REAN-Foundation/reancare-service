import { inject, injectable } from "tsyringe";
import { ICalorieBalanceRepo } from "../../database/repository.interfaces/daily.records/calorieBalance.repo.interface";
import { CalorieBalanceDomainModel } from '../../domain.types/daily.records/CalorieBalance/calorie.balance.domain.model';
import { CalorieBalanceDto } from '../../domain.types/daily.records/CalorieBalance/calorie.balance.dto';
import { CalorieBalanceSearchFilters, CalorieBalanceSearchResults } from '../../domain.types/daily.records/CalorieBalance/calorie.balance.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CalorieBalanceService {

    constructor(
        @inject('ICalorieBalanceRepo') private _calorieBalanceRepo: ICalorieBalanceRepo,
    ) {}

    create = async (addressDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto> => {
        return await this._calorieBalanceRepo.create(addressDomainModel);
    };

    getById = async (id: string): Promise<CalorieBalanceDto> => {
        return await this._calorieBalanceRepo.getById(id);
    };

    search = async (filters: CalorieBalanceSearchFilters): Promise<CalorieBalanceSearchResults> => {
        return await this._calorieBalanceRepo.search(filters);
    };

    update = async (id: string, addressDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto> => {
        return await this._calorieBalanceRepo.update(id, addressDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._calorieBalanceRepo.delete(id);
    };

}
