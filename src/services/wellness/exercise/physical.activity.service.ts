import { inject, injectable } from "tsyringe";
import { IPhysicalActivityRepo } from "../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface";
import { PhysicalActivityDomainModel } from '../../../domain.types/wellness/exercise/physical.activity/physical.activity.domain.model';
import { PhysicalActivityDto } from '../../../domain.types/wellness/exercise/physical.activity/physical.activity.dto';
import { PhysicalActivitySearchFilters, PhysicalActivitySearchResults } from '../../../domain.types/wellness/exercise/physical.activity/physical.activity.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PhysicalActivityService {

    constructor(
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo,
    ) {}

    create = async (physicalActivityDomainModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        return await this._physicalActivityRepo.create(physicalActivityDomainModel);
    };

    getById = async (id: string): Promise<PhysicalActivityDto> => {
        return await this._physicalActivityRepo.getById(id);
    };

    search = async (filters: PhysicalActivitySearchFilters): Promise<PhysicalActivitySearchResults> => {
        return await this._physicalActivityRepo.search(filters);
    };

    // eslint-disable-next-line max-len
    update = async (id: string, physicalActivityDomainModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        return await this._physicalActivityRepo.update(id, physicalActivityDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._physicalActivityRepo.delete(id);
    };

}
