import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBloodCholesterolRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.cholesterol.repo.interface";
import { BloodCholesterolDomainModel } from '../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.domain.model';
import { BloodCholesterolDto } from '../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.dto';
import { BloodCholesterolSearchFilters, BloodCholesterolSearchResults } from '../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodCholesterolService {

    constructor(
        @inject('IBloodCholesterolRepo') private _bloodCholesterolRepo: IBloodCholesterolRepo,
    ) {}

    create = async (bloodCholesterolDomainModel: BloodCholesterolDomainModel):
    Promise<BloodCholesterolDto> => {
        return await this._bloodCholesterolRepo.create(bloodCholesterolDomainModel);
    };

    getById = async (id: uuid): Promise<BloodCholesterolDto> => {
        return await this._bloodCholesterolRepo.getById(id);
    };

    search = async (filters: BloodCholesterolSearchFilters): Promise<BloodCholesterolSearchResults> => {
        return await this._bloodCholesterolRepo.search(filters);
    };

    update = async (id: uuid, bloodCholesterolDomainModel: BloodCholesterolDomainModel):
    Promise<BloodCholesterolDto> => {
        return await this._bloodCholesterolRepo.update(id, bloodCholesterolDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodCholesterolRepo.delete(id);
    };

}
