import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBloodPressureRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { BloodPressureDomainModel } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { BloodPressureDto } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto';
import { BloodPressureSearchFilters, BloodPressureSearchResults } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.search.types';
import { BloodPressureStore } from "../../../modules/ehr/services/blood.pressure.store";
import { Loader } from "../../../startup/loader";
import { ConfigurationManager } from "../../../config/configuration.manager";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodPressureService {

    _ehrBloodPressureStore: BloodPressureStore = null;

    constructor(
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBloodPressureStore = Loader.container.resolve(BloodPressureStore);
        }
    }

    create = async (bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {

        if (this._ehrBloodPressureStore) { 
            const ehrId = await this._ehrBloodPressureStore.add(bloodPressureDomainModel);
            bloodPressureDomainModel.EhrId = ehrId;            
        }

        var dto = await this._bloodPressureRepo.create(bloodPressureDomainModel);
        return dto;
    };

    getById = async (id: uuid): Promise<BloodPressureDto> => {
        return await this._bloodPressureRepo.getById(id);
    };

    search = async (filters: BloodPressureSearchFilters): Promise<BloodPressureSearchResults> => {
        return await this._bloodPressureRepo.search(filters);
    };

    update = async (id: uuid, bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        var dto = await this._bloodPressureRepo.update(id, bloodPressureDomainModel);
        if (this._ehrBloodPressureStore) { 
            await this._ehrBloodPressureStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodPressureRepo.delete(id);
    };

}
