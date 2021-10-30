import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBloodOxygenSaturationRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface";
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { BloodOxygenSaturationDto } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BloodOxygenSaturationSearchFilters, BloodOxygenSaturationSearchResults } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodOxygenSaturationService {

    constructor(
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
    ) { }

    create = async (bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {
        return await this._bloodOxygenSaturationRepo.create(bloodOxygenSaturationDomainModel);
    };

    getById = async (id: uuid): Promise<BloodOxygenSaturationDto> => {
        return await this._bloodOxygenSaturationRepo.getById(id);
    };

    search = async (filters: BloodOxygenSaturationSearchFilters): Promise<BloodOxygenSaturationSearchResults> => {
        return await this._bloodOxygenSaturationRepo.search(filters);
    };

    update = async (id: uuid, bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {
        return await this._bloodOxygenSaturationRepo.update(id, bloodOxygenSaturationDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodOxygenSaturationRepo.delete(id);
    };

}
