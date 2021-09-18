import { inject, injectable } from "tsyringe";
import { IMoveMinutesRepo } from "../../database/repository.interfaces/daily.records/move.minutes.repo.interface";
import { MoveMinutesDomainModel } from '../../domain.types/daily.records/move.minutes/move.minutes.domain.model';
import { MoveMinutesDto } from '../../domain.types/daily.records/move.minutes/move.minutes.dto';
import { MoveMinutesSearchResults, MoveMinutesSearchFilters } from '../../domain.types/daily.records/move.minutes/move.minutes.search.types';

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

    getById = async (id: string): Promise<MoveMinutesDto> => {
        return await this._moveMinutesRepo.getById(id);
    };

    search = async (filters: MoveMinutesSearchFilters): Promise<MoveMinutesSearchResults> => {
        return await this._moveMinutesRepo.search(filters);
    };

    update = async (id: string, moveMinutesDomainModel: MoveMinutesDomainModel):
    Promise<MoveMinutesDto> => {
        return await this._moveMinutesRepo.update(id, moveMinutesDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._moveMinutesRepo.delete(id);
    };

}
