import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IDrugRepo } from "../../../database/repository.interfaces/clinical/medication/drug.repo.interface";
import { DrugDomainModel } from '../../../domain.types/clinical/medication/drug/drug.domain.model';
import { DrugDto } from '../../../domain.types/clinical/medication/drug/drug.dto';
import { DrugSearchFilters, DrugSearchResults } from '../../../domain.types/clinical/medication/drug/drug.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DrugService {

    constructor(
        @inject('IDrugRepo') private _drugRepo: IDrugRepo,
    ) { }

    create = async (drugDomainModel: DrugDomainModel):
    Promise<DrugDto> => {
        return await this._drugRepo.create(drugDomainModel);
    };

    getById = async (id: uuid): Promise<DrugDto> => {
        return await this._drugRepo.getById(id);
    };

    getByName = async (drugName: string): Promise<DrugDto> => {
        return await this._drugRepo.getByName(drugName);
    };

    search = async (filters: DrugSearchFilters): Promise<DrugSearchResults> => {
        return await this._drugRepo.search(filters);
    };

    update = async (id: uuid, drugDomainModel: DrugDomainModel):
    Promise<DrugDto> => {
        return await this._drugRepo.update(id, drugDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._drugRepo.delete(id);
    };

}
