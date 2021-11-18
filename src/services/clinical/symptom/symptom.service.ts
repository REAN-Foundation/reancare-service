import { inject, injectable } from "tsyringe";
import { ISymptomRepo } from "../../../database/repository.interfaces/clinical/symptom/symptom.repo.interface";
import { SymptomDomainModel } from '../../../domain.types/clinical/symptom/symptom/symptom.domain.model';
import { SymptomDto } from '../../../domain.types/clinical/symptom/symptom/symptom.dto';
import { SymptomSearchFilters, SymptomSearchResults } from '../../../domain.types/clinical/symptom/symptom/symptom.search.types';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class SymptomService extends BaseResourceService {

    constructor(
        @inject('ISymptomRepo') private _symptomRepo: ISymptomRepo,
    ) {
        super();
    }

    create = async (addressDomainModel: SymptomDomainModel): Promise<SymptomDto> => {
        return await this._symptomRepo.create(addressDomainModel);
    };

    getById = async (id: uuid): Promise<SymptomDto> => {
        return await this._symptomRepo.getById(id);
    };

    search = async (filters: SymptomSearchFilters): Promise<SymptomSearchResults> => {
        return await this._symptomRepo.search(filters);
    };

    update = async (id: uuid, addressDomainModel: SymptomDomainModel): Promise<SymptomDto> => {
        return await this._symptomRepo.update(id, addressDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._symptomRepo.delete(id);
    };

}
