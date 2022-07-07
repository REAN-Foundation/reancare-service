import { StandDomainModel } from "../../../../domain.types/wellness/daily.records/stand/stand.domain.model";
import { StandDto } from "../../../../domain.types/wellness/daily.records/stand/stand.dto";
import { StandSearchFilters, StandSearchResults } from "../../../../domain.types/wellness/daily.records/stand/stand.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////

export interface IStandRepo {

    create(standDomainModel: StandDomainModel): Promise<StandDto>;

    getById(id: string): Promise<StandDto>;

    search(filters: StandSearchFilters): Promise<StandSearchResults>;

    update(id: string, standDomainModel: StandDomainModel): Promise<StandDto>;

    delete(id: string): Promise<boolean>;

}
