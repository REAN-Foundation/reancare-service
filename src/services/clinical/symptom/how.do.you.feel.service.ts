import { inject, injectable } from "tsyringe";
import { IHowDoYouFeelRepo } from "../../../database/repository.interfaces/clinical/symptom/how.do.you.feel.repo.interface";
import { HowDoYouFeelDomainModel } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { HowDoYouFeelDto } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto';
import { HowDoYouFeelSearchFilters, HowDoYouFeelSearchResults } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.search.types';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HowDoYouFeelService  extends BaseResourceService {

    constructor(
        @inject('IHowDoYouFeelRepo') private _howDoYouFeelRepo: IHowDoYouFeelRepo,
    ) {
        super();
    }

    create = async (howDoYouFeelDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.create(howDoYouFeelDomainModel);
    };

    getById = async (id: uuid): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.getById(id);
    };

    search = async (filters: HowDoYouFeelSearchFilters): Promise<HowDoYouFeelSearchResults> => {
        return await this._howDoYouFeelRepo.search(filters);
    };

    update = async (id: uuid, howDoYouFeelDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.update(id, howDoYouFeelDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._howDoYouFeelRepo.delete(id);
    };

}
