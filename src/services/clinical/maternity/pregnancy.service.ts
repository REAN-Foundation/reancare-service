import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IPregnancyRepo } from "../../../database/repository.interfaces/clinical/maternity/pregnancy.repo.interface";
import { PregnancyDomainModel } from "../../../domain.types/clinical/maternity/pregnancy/pregnancy.domain.model";
import { PregnancyDto } from "../../../domain.types/clinical/maternity/pregnancy/pregnancy.dto";
import { PregnancySearchFilters, PregnancySearchResults } from "../../../domain.types/clinical/maternity/pregnancy/pregnancy.search.type";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PregnancyService {

    constructor(
        @inject('IPregnancyRepo') private _pregnancyRepo: IPregnancyRepo,
    ) { }

    create = async (pregnancyDomainModel: PregnancyDomainModel): Promise<PregnancyDto> => {
        return await this._pregnancyRepo.create(pregnancyDomainModel);
    };

    getById = async (id: uuid): Promise<PregnancyDto> => {
        return await this._pregnancyRepo.getById(id);
    };

    search = async (filters: PregnancySearchFilters): Promise<PregnancySearchResults> => {
        return await this._pregnancyRepo.search(filters);
    };

    update = async (id: uuid, pregnancyDomainModel: PregnancyDomainModel): Promise<PregnancyDto> => {
        return await this._pregnancyRepo.update(id, pregnancyDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._pregnancyRepo.delete(id);
    };

}
