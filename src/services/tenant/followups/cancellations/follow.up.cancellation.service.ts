import { FollowUpCancellationDomainModel } from "../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.domain.model";
import { IFollowUpCancellationRepo } from "../../../../database/repository.interfaces/tenant/followups/cancellations/follow.up.cancellation.repo.interface";
import { inject, injectable } from "tsyringe";
import { FollowUpCancellationDto } from "../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.dto";
import { FollowUpCancellationSearchFilters, FollowUpCancellationSearchResults } from "../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FollowUpCancellationService {

    constructor(
        @inject('IFollowUpCancellationRepo') private _followUpCancellationRepo: IFollowUpCancellationRepo,
    ) {}

    create = async (cancellationDatesDomainModel: FollowUpCancellationDomainModel): Promise<FollowUpCancellationDto> => {
        return await this._followUpCancellationRepo.create(cancellationDatesDomainModel);
    };

    getById = async (id: string): Promise<FollowUpCancellationDto> => {
        return await this._followUpCancellationRepo.getById(id);
    };

    search = async (filters: FollowUpCancellationSearchFilters): Promise<FollowUpCancellationSearchResults> => {
        return await this._followUpCancellationRepo.search(filters);
    };

    update = async (id: string, model: FollowUpCancellationDomainModel): Promise<FollowUpCancellationDto> => {
        return await this._followUpCancellationRepo.update(id, model);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._followUpCancellationRepo.delete(id);
    };

}
