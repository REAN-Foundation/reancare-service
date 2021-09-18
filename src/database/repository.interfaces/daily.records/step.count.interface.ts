import { StepCountDomainModel } from "../../../domain.types/daily.records/step.count/step.count.domain.model";
import { StepCountDto } from "../../../domain.types/daily.records/step.count/step.count.dto";
import { StepCountSearchFilters, StepCountSearchResults } from "../../../domain.types/daily.records/step.count/step.count.search.types";

export interface IStepCountRepo {

    create(stepCountDomainModel: StepCountDomainModel): Promise<StepCountDto>;

    getById(id: string): Promise<StepCountDto>;

    search(filters: StepCountSearchFilters): Promise<StepCountSearchResults>;

    update(id: string, stepCountDomainModel: StepCountDomainModel): Promise<StepCountDto>;

    delete(id: string): Promise<boolean>;

}
