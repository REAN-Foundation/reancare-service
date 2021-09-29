import { SleepDomainModel } from "../../../domain.types/daily.records/Sleep/sleep.domain.model";
import { SleepDto } from "../../../domain.types/daily.records/Sleep/sleep.dto";
import { SleepSearchFilters, SleepSearchResults } from "../../../domain.types/daily.records/Sleep/sleep.search.types";

export interface ISleepRepo {

    create(sleepDomainModel: SleepDomainModel): Promise<SleepDto>;

    getById(id: string): Promise<SleepDto>;

    search(filters: SleepSearchFilters): Promise<SleepSearchResults>;

    update(id: string, sleepDomainModel: SleepDomainModel): Promise<SleepDto>;

    delete(id: string): Promise<boolean>;

}
