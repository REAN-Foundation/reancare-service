import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBloodOxygenSaturationRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface";
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { BloodOxygenSaturationDto } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
import { BloodOxygenSaturationSearchFilters, BloodOxygenSaturationSearchResults } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types';
import { Loader } from "../../../startup/loader";
import { BloodOxygenSaturationStore } from "../../../modules/ehr/services/blood.oxygen.saturation.store";
import { Logger } from "../../../common/logger";
import { ConfigurationManager } from "../../../config/configuration.manager";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodOxygenSaturationService {

    _ehrBloodOxygenSaturationStore: BloodOxygenSaturationStore = null;

    constructor(
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBloodOxygenSaturationStore = Loader.container.resolve(BloodOxygenSaturationStore);
        }
    }

    create = async (bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {

        if (this._ehrBloodOxygenSaturationStore) { 
            const ehrId = await this._ehrBloodOxygenSaturationStore.add(bloodOxygenSaturationDomainModel);
            bloodOxygenSaturationDomainModel.EhrId = ehrId;        
        }

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
        if (this._ehrBloodOxygenSaturationStore) { 
            await this._ehrBloodOxygenSaturationStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodOxygenSaturationRepo.delete(id);
    };

}
