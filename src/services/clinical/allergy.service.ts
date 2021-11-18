import { inject, injectable } from "tsyringe";
import { IAllergyRepo } from "../../database/repository.interfaces/clinical/allergy.repo.interface";
import { AllergyDomainModel } from '../../domain.types/clinical/allergy/allergy.domain.model';
import { AllergyDto } from '../../domain.types/clinical/allergy/allergy.dto';
import { AllergySearchFilters, AllergySearchResults } from "../../domain.types/clinical/allergy/allergy.search.types";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AllergyService extends BaseResourceService {

    constructor(
        @inject('IAllergyRepo') private _allergyRepo: IAllergyRepo,
    ) {
        super();
    }

    create = async (allergyDomainModel: AllergyDomainModel): Promise<AllergyDto> => {
        return await this._allergyRepo.create(allergyDomainModel);
    };

    getById = async (id: uuid): Promise<AllergyDto> => {
        return await this._allergyRepo.getById(id);
    };

    getForPatient = async (id: uuid): Promise<AllergyDto[]> => {
        return await this._allergyRepo.getForPatient(id);
    };

    search = async (filters: AllergySearchFilters): Promise<AllergySearchResults> => {
        return await this._allergyRepo.search(filters);
    };

    update = async (id: uuid, allergyDomainModel: AllergyDomainModel): Promise<AllergyDto> => {
        return await this._allergyRepo.update(id, allergyDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._allergyRepo.delete(id);
    };

}
