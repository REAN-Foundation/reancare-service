import { FollowUpCancellationDto } from "../../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.dto";
import { FollowUpCancellationDomainModel } from "../../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.domain.model";
import { FollowUpCancellationSearchFilters, FollowUpCancellationSearchResults } from "../../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.search.types";

export interface IFollowUpCancellationRepo {

    create(model: FollowUpCancellationDomainModel): Promise<FollowUpCancellationDto>;

    getById(id: string): Promise<FollowUpCancellationDto>;

    search(filters: FollowUpCancellationSearchFilters): Promise<FollowUpCancellationSearchResults>;

    update(id: string, model: FollowUpCancellationDomainModel): Promise<FollowUpCancellationDto>;

    delete(id: string): Promise<boolean>;

}
