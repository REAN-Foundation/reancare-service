import { inject, injectable } from "tsyringe";
import { IBloodGlucoseRepo } from "../../database/repository.interfaces/biometrics/blood.glucose.repo.interface";
import { BloodGlucoseDomainModel } from '../../domain.types/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseDto } from '../../domain.types/biometrics/blood.glucose/blood.glucose.dto';
import { BloodGlucoseSearchResults, BloodGlucoseSearchFilters } from '../../domain.types/biometrics/blood.glucose/blood.glucose.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodGlucoseService {

    constructor(
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
    ) {}

    create = async (bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto> => {
        return await this._bloodGlucoseRepo.create(bloodGlucoseDomainModel);
    };

    getById = async (id: string): Promise<BloodGlucoseDto> => {
        return await this._bloodGlucoseRepo.getById(id);
    };

    update = async (id: string, bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto> => {
        return await this._bloodGlucoseRepo.update(id, bloodGlucoseDomainModel);
    };

    search = async (filters: BloodGlucoseSearchFilters): Promise<BloodGlucoseSearchResults> => {
        return await this._bloodGlucoseRepo.search(filters);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._bloodGlucoseRepo.delete(id);
    };

}

