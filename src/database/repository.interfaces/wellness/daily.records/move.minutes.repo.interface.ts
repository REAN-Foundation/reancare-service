
////////////////////////////////////////////////////////////////////////////////////////////////

import { MoveMinutesDomainModel } from "../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.domain.model";
import { MoveMinutesDto } from "../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.dto";
import { MoveMinutesSearchFilters, MoveMinutesSearchResults } from "../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.search.types";

export interface IMoveMinutesRepo {

    create(moveMinutesDomainModel: MoveMinutesDomainModel): Promise<MoveMinutesDto>;

    getById(id: string): Promise<MoveMinutesDto>;
    
    search(filters: MoveMinutesSearchFilters): Promise<MoveMinutesSearchResults>;

    update(id: string, moveMinutesDomainModel: MoveMinutesDomainModel):
    Promise<MoveMinutesDto>;

    delete(id: string): Promise<boolean>;

}
