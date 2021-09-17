import { inject, injectable } from "tsyringe";
import { IBloodPressureRepo } from "../../database/repository.interfaces/biometrics/blood.pressure.repo.interface";
import { BloodPressureDomainModel } from '../../domain.types/biometrics/blood.pressure/blood.pressure.domain.model';
import { BloodPressureDto } from '../../domain.types/biometrics/blood.pressure/blood.pressure.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BloodPressureSearchResults, BloodPressureSearchFilters } from '../../domain.types/biometrics/blood.pressure/blood.pressure.search.types';

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

    getById = async (id: string): Promise<BloodPressureDto> => {
        return await this._bloodPressureRepo.getById(id);
    };

    search = async (filters: BloodPressureSearchFilters): Promise<BloodPressureSearchResults> => {
        return await this._bloodPressureRepo.search(filters);
    };

    update = async (id: string, bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        return await this._bloodPressureRepo.update(id, bloodPressureDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._bloodPressureRepo.delete(id);
    };

}