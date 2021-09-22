import { inject, injectable } from "tsyringe";
import { IMeditationRepo } from "../../database/repository.interfaces/exercise/meditation.repo.interface";
import { MeditationDomainModel } from '../../domain.types/exercise/meditation/meditation.domain.model';
import { MeditationDto } from '../../domain.types/exercise/meditation/meditation.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MeditationSearchResults, MeditationSearchFilters } from '../../domain.types/exercise/meditation/meditation.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MeditationService {

    constructor(
        @inject('IMeditationRepo') private _meditationRepo: IMeditationRepo,
    ) { }

    create = async (meditationDomainModel: MeditationDomainModel):
    Promise<MeditationDto> => {
        return await this._meditationRepo.create(meditationDomainModel);
    };

    getById = async (id: string): Promise<MeditationDto> => {
        return await this._meditationRepo.getById(id);
    };

    search = async (filters: MeditationSearchFilters): Promise<MeditationSearchResults> => {
        return await this._meditationRepo.search(filters);
    };

    update = async (id: string, meditationDomainModel: MeditationDomainModel):
    Promise<MeditationDto> => {
        return await this._meditationRepo.update(id, meditationDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._meditationRepo.delete(id);
    };

}

