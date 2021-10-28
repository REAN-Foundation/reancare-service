import { inject, injectable } from "tsyringe";
import { ISymptomTypeRepo } from "../../../database/repository.interfaces/clinical/symptom/symptom.type.repo.interface";
import { SymptomTypeDomainModel } from '../../../domain.types/clinical/symptom/symptom.type/symptom.type.domain.model';
import { SymptomTypeDto } from '../../../domain.types/clinical/symptom/symptom.type/symptom.type.dto';
import { SymptomTypeSearchFilters, SymptomTypeSearchResults } from '../../../domain.types/clinical/symptom/symptom.type/symptom.type.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class SymptomTypeService {

    constructor(
        @inject('ISymptomTypeRepo') private _symptomTypeRepo: ISymptomTypeRepo,
    ) {}

    create = async (domainModel: SymptomTypeDomainModel): Promise<SymptomTypeDto> => {
        return await this._symptomTypeRepo.create(domainModel);
    };

    getById = async (id: string): Promise<SymptomTypeDto> => {
        return await this._symptomTypeRepo.getById(id);
    };

    search = async (filters: SymptomTypeSearchFilters): Promise<SymptomTypeSearchResults> => {
        return await this._symptomTypeRepo.search(filters);
    };

    update = async (id: string, domainModel: SymptomTypeDomainModel): Promise<SymptomTypeDto> => {
        return await this._symptomTypeRepo.update(id, domainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._symptomTypeRepo.delete(id);
    };

}
