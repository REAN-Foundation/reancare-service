
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { SleepDomainModel } from "../../../../domain.types/wellness/daily.records/sleep/sleep.domain.model";
import { SleepDto } from "../../../../domain.types/wellness/daily.records/sleep/sleep.dto";
import { SleepSearchFilters, SleepSearchResults } from "../../../../domain.types/wellness/daily.records/sleep/sleep.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISleepRepo {

    create(sleepDomainModel: SleepDomainModel): Promise<SleepDto>;

    getById(id: uuid): Promise<SleepDto>;

    search(filters: SleepSearchFilters): Promise<SleepSearchResults>;

    update(id: uuid, sleepDomainModel: SleepDomainModel): Promise<SleepDto>;

    delete(id: uuid): Promise<boolean>;

    getSleepStatsForLastWeek(patientUserId: uuid): Promise<any>;

    getSleepStatsForLastMonth(patientUserId: uuid): Promise<any>;

}
