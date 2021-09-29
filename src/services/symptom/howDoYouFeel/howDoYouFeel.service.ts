import { inject, injectable } from "tsyringe";
import { IHowDoYouFeelRepo } from "../../../database/repository.interfaces/symptom/howDoYouFeel/howDoYouFeel.repo.interface";
import { HowDoYouFeelDomainModel } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { HowDoYouFeelDto } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto';
import { HowDoYouFeelSearchResults, HowDoYouFeelSearchFilters } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HowDoYouFeelService {

    constructor(
        @inject('IHowDoYouFeelRepo') private _howDoYouFeelRepo: IHowDoYouFeelRepo,
    ) {}

    create = async (howDoYouFeelDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.create(howDoYouFeelDomainModel);
    };

    getById = async (id: string): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.getById(id);
    };

    search = async (filters: HowDoYouFeelSearchFilters): Promise<HowDoYouFeelSearchResults> => {
        return await this._howDoYouFeelRepo.search(filters);
    };

    update = async (id: string, howDoYouFeelDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.update(id, howDoYouFeelDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._howDoYouFeelRepo.delete(id);
    };

}
