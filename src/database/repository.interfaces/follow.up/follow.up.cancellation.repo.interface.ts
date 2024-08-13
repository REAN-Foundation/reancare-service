import { FollowUpCancellationDomainModel } from "../../../domain.types/follow.up/follow.up.cancellation.domain.model";
import { FollowUpCancellationDto } from "../../../domain.types/follow.up/follow.up.cancellation.dto";
import { FollowUpCancellationSearchFilters, FollowUpCancellationSearchResults } from "../../../domain.types/follow.up/follow.up.cancellation.search.types";

export interface IFollowUpCancellationRepo {

    create(model: FollowUpCancellationDomainModel): Promise<FollowUpCancellationDto>;

    getById(id: string): Promise<FollowUpCancellationDto>;

    search(filters: FollowUpCancellationSearchFilters): Promise<FollowUpCancellationSearchResults>;

    update(id: string, model: FollowUpCancellationDomainModel): Promise<FollowUpCancellationDto>;

    delete(id: string): Promise<boolean>;

}
