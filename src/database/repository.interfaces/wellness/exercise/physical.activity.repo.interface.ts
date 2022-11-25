import { PhysicalActivityDomainModel } from "../../../../domain.types/wellness/exercise/physical.activity/physical.activity.domain.model";
import { PhysicalActivityDto } from "../../../../domain.types/wellness/exercise/physical.activity/physical.activity.dto";
import { PhysicalActivitySearchFilters, PhysicalActivitySearchResults } from "../../../../domain.types/wellness/exercise/physical.activity/physical.activity.search.types";

export interface IPhysicalActivityRepo {

    create(physicalActivityDomainModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto>;

    getById(id: string): Promise<PhysicalActivityDto>;

    search(filters: PhysicalActivitySearchFilters): Promise<PhysicalActivitySearchResults>;

    update(id: string, physicalActivityDomainModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto>;

    delete(id: string): Promise<boolean>;

    getStats(patientUserId: string, numMonths: number): Promise<any>;

}
