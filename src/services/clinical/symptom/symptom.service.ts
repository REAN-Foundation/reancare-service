import { inject, injectable } from "tsyringe";
import { ISymptomRepo } from "../../../database/repository.interfaces/clinical/symptom/symptom.repo.interface";
import { SymptomDomainModel } from '../../../domain.types/clinical/symptom/symptom/symptom.domain.model';
import { SymptomDto } from '../../../domain.types/clinical/symptom/symptom/symptom.dto';
import { SymptomSearchResults, SymptomSearchFilters } from '../../../domain.types/clinical/symptom/symptom/symptom.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class SymptomService {

    constructor(
        @inject('ISymptomRepo') private _symptomRepo: ISymptomRepo,
    ) {}

    create = async (addressDomainModel: SymptomDomainModel): Promise<SymptomDto> => {
        return await this._symptomRepo.create(addressDomainModel);
    };

    getById = async (id: string): Promise<SymptomDto> => {
        return await this._symptomRepo.getById(id);
    };

    search = async (filters: SymptomSearchFilters): Promise<SymptomSearchResults> => {
        return await this._symptomRepo.search(filters);
    };

    update = async (id: string, addressDomainModel: SymptomDomainModel): Promise<SymptomDto> => {
        return await this._symptomRepo.update(id, addressDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._symptomRepo.delete(id);
    };

}
