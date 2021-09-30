import { inject, injectable } from "tsyringe";
import { IAllergyRepo } from "../../database/repository.interfaces/clinical/allergy.repo.interface";
import { AllergyDomainModel } from '../../domain.types/clinical/allergy/allergy.domain.model';
import { AllergyDto } from '../../domain.types/clinical/allergy/allergy.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AllergyService {

    constructor(
        @inject('IAllergyRepo') private _allergyRepo: IAllergyRepo,
    ) {}

    create = async (allergyDomainModel: AllergyDomainModel): Promise<AllergyDto> => {
        return await this._allergyRepo.create(allergyDomainModel);
    };

    getById = async (id: string): Promise<AllergyDto> => {
        return await this._allergyRepo.getById(id);
    };

    search = async (id: string): Promise<AllergyDto[]> => {
        return await this._allergyRepo.search(id);
    };

    update = async (id: string, allergyDomainModel: AllergyDomainModel): Promise<AllergyDto> => {
        return await this._allergyRepo.update(id, allergyDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._allergyRepo.delete(id);
    };

}
