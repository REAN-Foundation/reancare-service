import { inject, injectable } from "tsyringe";
import { IMedicalConditionRepo } from "../../database/repository.interfaces/clinical/medical.condition.repo.interface";
import { MedicalConditionDomainModel } from '../../domain.types/clinical/medical.condition/medical.condition.domain.model';
import { MedicalConditionDto } from '../../domain.types/clinical/medical.condition/medical.condition.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MedicalConditionSearchFilters, MedicalConditionSearchResults } from '../../domain.types/clinical/medical.condition/medical.condition.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MedicalConditionService {

    constructor(
        @inject('IMedicalConditionRepo') private _medicalConditionRepo: IMedicalConditionRepo,
    ) { }

    create = async (medicalConditionDomainModel: MedicalConditionDomainModel):
    Promise<MedicalConditionDto> => {
        return await this._medicalConditionRepo.create(medicalConditionDomainModel);
    };

    getById = async (id: string): Promise<MedicalConditionDto> => {
        return await this._medicalConditionRepo.getById(id);
    };

    search = async (filters: MedicalConditionSearchFilters): Promise<MedicalConditionSearchResults> => {
        return await this._medicalConditionRepo.search(filters);
    };

    update = async (id: string, medicalConditionDomainModel: MedicalConditionDomainModel):
    Promise<MedicalConditionDto> => {
        return await this._medicalConditionRepo.update(id, medicalConditionDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._medicalConditionRepo.delete(id);
    };

}
