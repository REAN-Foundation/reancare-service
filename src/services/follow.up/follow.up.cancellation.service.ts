import { inject, injectable } from "tsyringe";
import { IFollowUpCancellationRepo } from "../../database/repository.interfaces/follow.up/follow.up.cancellation.repo.interface";
import { FollowUpCancellationDomainModel } from "../../domain.types/follow.up/follow.up.cancellation.domain.model";
import { FollowUpCancellationDto } from "../../domain.types/follow.up/follow.up.cancellation.dto";
import { FollowUpCancellationSearchFilters, FollowUpCancellationSearchResults } from "../../domain.types/follow.up/follow.up.cancellation.search.types";

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
