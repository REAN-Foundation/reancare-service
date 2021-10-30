import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBloodPressureRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { BloodPressureDomainModel } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { BloodPressureDto } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto';
import { BloodPressureSearchFilters, BloodPressureSearchResults } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodPressureService {

    constructor(
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
    ) { }

    create = async (bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        return await this._bloodPressureRepo.create(bloodPressureDomainModel);
    };

    getById = async (id: uuid): Promise<BloodPressureDto> => {
        return await this._bloodPressureRepo.getById(id);
    };

    search = async (filters: BloodPressureSearchFilters): Promise<BloodPressureSearchResults> => {
        return await this._bloodPressureRepo.search(filters);
    };

    update = async (id: uuid, bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        return await this._bloodPressureRepo.update(id, bloodPressureDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodPressureRepo.delete(id);
    };

}
