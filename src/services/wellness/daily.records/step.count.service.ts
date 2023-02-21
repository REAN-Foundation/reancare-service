import { inject, injectable } from "tsyringe";
import { IStepCountRepo } from "../../../database/repository.interfaces/wellness/daily.records/step.count.interface";
import { StepCountDomainModel } from '../../../domain.types/wellness/daily.records/step.count/step.count.domain.model';
import { StepCountDto } from '../../../domain.types/wellness/daily.records/step.count/step.count.dto';
import { StepCountSearchFilters, StepCountSearchResults } from '../../../domain.types/wellness/daily.records/step.count/step.count.search.types';

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

    getByRecordDate = async (recordDate: Date): Promise<StepCountDto> => {
        return await this._stepCountRepo.getByRecordDate(recordDate);
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
