import { inject, injectable } from "tsyringe";
import { IBloodGlucoseRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { BloodGlucoseDomainModel } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseDto } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto';
import { BloodGlucoseSearchFilters, BloodGlucoseSearchResults } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.search.types';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodGlucoseService extends BaseResourceService {

    constructor(
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
    ) {
        super();
    }

    create = async (bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto> => {
        return await this._bloodGlucoseRepo.create(bloodGlucoseDomainModel);
    };

    getById = async (id: uuid): Promise<BloodGlucoseDto> => {
        return await this._bloodGlucoseRepo.getById(id);
    };

    update = async (id: uuid, bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto> => {
        return await this._bloodGlucoseRepo.update(id, bloodGlucoseDomainModel);
    };

    search = async (filters: BloodGlucoseSearchFilters): Promise<BloodGlucoseSearchResults> => {
        return await this._bloodGlucoseRepo.search(filters);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodGlucoseRepo.delete(id);
    };

}
