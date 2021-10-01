
import { SleepDomainModel } from "../../../../domain.types/wellness/daily.records/sleep/sleep.domain.model";
import { SleepDto } from "../../../../domain.types/wellness/daily.records/sleep/sleep.dto";
import { SleepSearchFilters, SleepSearchResults } from "../../../../domain.types/wellness/daily.records/sleep/sleep.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISleepRepo {

    create(sleepDomainModel: SleepDomainModel): Promise<SleepDto>;

    getById(id: string): Promise<SleepDto>;

    search(filters: SleepSearchFilters): Promise<SleepSearchResults>;

    update(id: string, sleepDomainModel: SleepDomainModel): Promise<SleepDto>;

    delete(id: string): Promise<boolean>;

}
