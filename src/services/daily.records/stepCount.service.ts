import { inject, injectable } from "tsyringe";
import { IStepCountRepo } from "../../database/repository.interfaces/daily.records/stepCount.interface";
import { StepCountDomainModel } from '../../domain.types/daily.records/StepCount/step.count.domain.model';
import { StepCountDto } from '../../domain.types/daily.records/StepCount/step.count.dto';
import { StepCountSearchFilters, StepCountSearchResults } from '../../domain.types/daily.records/StepCount/step.count.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StepCountService {

    constructor(
        @inject('IStepCountRepo') private _stepCountRepo: IStepCountRepo,
    ) {}

    create = async (stepCountDomainModel: StepCountDomainModel): Promise<StepCountDto> => {
        return await this._stepCountRepo.create(stepCountDomainModel);
    };

    getById = async (id: string): Promise<StepCountDto> => {
        return await this._stepCountRepo.getById(id);
    };

    search = async (filters: StepCountSearchFilters): Promise<StepCountSearchResults> => {
        return await this._stepCountRepo.search(filters);
    };

    update = async (id: string, stepCountDomainModel: StepCountDomainModel): Promise<StepCountDto> => {
        return await this._stepCountRepo.update(id, stepCountDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._stepCountRepo.delete(id);
    };

}
