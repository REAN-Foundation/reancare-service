import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IMoveMinutesRepo } from "../../../database/repository.interfaces/wellness/daily.records/move.minutes.repo.interface";
import { MoveMinutesDomainModel } from '../../../domain.types/wellness/daily.records/move.minutes/move.minutes.domain.model';
import { MoveMinutesDto } from '../../../domain.types/wellness/daily.records/move.minutes/move.minutes.dto';
import { MoveMinutesSearchFilters, MoveMinutesSearchResults } from '../../../domain.types/wellness/daily.records/move.minutes/move.minutes.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MoveMinutesService {

    constructor(
        @inject('IMoveMinutesRepo') private _moveMinutesRepo: IMoveMinutesRepo,
    ) { }

    create = async (moveMinutesDomainModel: MoveMinutesDomainModel):
    Promise<MoveMinutesDto> => {
        return await this._moveMinutesRepo.create(moveMinutesDomainModel);
    };

    getById = async (id: uuid): Promise<MoveMinutesDto> => {
        return await this._moveMinutesRepo.getById(id);
    };

    search = async (filters: MoveMinutesSearchFilters): Promise<MoveMinutesSearchResults> => {
        return await this._moveMinutesRepo.search(filters);
    };

    update = async (id: uuid, moveMinutesDomainModel: MoveMinutesDomainModel):
    Promise<MoveMinutesDto> => {
        return await this._moveMinutesRepo.update(id, moveMinutesDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._moveMinutesRepo.delete(id);
    };

}
