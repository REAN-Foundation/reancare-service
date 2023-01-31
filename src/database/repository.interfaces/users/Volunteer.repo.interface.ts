import { VolunteerDomainModel } from "../../../domain.types/users/Volunteer/volunteer.domain.model";
import { VolunteerDetailsDto } from "../../../domain.types/users/Volunteer/volunteer.dto";
import { VolunteerSearchFilters, VolunteerSearchResults } from "../../../domain.types/users/Volunteer/volunteer.search.types";

export interface IVolunteerRepo {

    create(entity: VolunteerDomainModel): Promise<VolunteerDetailsDto>;

    getByUserId(userId: string): Promise<VolunteerDetailsDto>;

    updateByUserId(userId: string, updateModel: VolunteerDomainModel): Promise<VolunteerDetailsDto>;

    search(filters: VolunteerSearchFilters): Promise<VolunteerSearchResults>;
    
    deleteByUserId(userId: string): Promise<boolean>;

}
