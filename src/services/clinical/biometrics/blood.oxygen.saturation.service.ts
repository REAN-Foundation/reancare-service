import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBloodOxygenSaturationRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface";
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { BloodOxygenSaturationDto } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BloodOxygenSaturationSearchFilters, BloodOxygenSaturationSearchResults } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types';
import { Loader } from "../../../startup/loader";
import { BloodOxygenSaturationStore } from "../../../modules/ehr/services/blood.oxygen.saturation.store";
import { Logger } from "../../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodOxygenSaturationService {

    _ehrBloodOxygenSaturationStore: BloodOxygenSaturationStore = null;

    constructor(
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
    ) {
        this._ehrBloodOxygenSaturationStore = Loader.container.resolve(BloodOxygenSaturationStore);
    }

    create = async (bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {
        const ehrId = await this._ehrBloodOxygenSaturationStore.add(bloodOxygenSaturationDomainModel);
        bloodOxygenSaturationDomainModel.EhrId = ehrId;

        Logger.instance().log(`ehr id:: ${JSON.stringify(bloodOxygenSaturationDomainModel.EhrId)}`);

        var dto = await this._bloodOxygenSaturationRepo.create(bloodOxygenSaturationDomainModel);
        return dto;
    };

    getById = async (id: uuid): Promise<BloodOxygenSaturationDto> => {
        return await this._bloodOxygenSaturationRepo.getById(id);
    };

    search = async (filters: BloodOxygenSaturationSearchFilters): Promise<BloodOxygenSaturationSearchResults> => {
        return await this._bloodOxygenSaturationRepo.search(filters);
    };

    update = async (id: uuid, bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {
        var dto = await this._bloodOxygenSaturationRepo.update(id, bloodOxygenSaturationDomainModel);
        await this._ehrBloodOxygenSaturationStore.update(dto.EhrId, dto);
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodOxygenSaturationRepo.delete(id);
    };

}
