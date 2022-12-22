import { GoalDomainModel } from "../../../../domain.types/users/patient/goal/goal.domain.model";
import { GoalDto } from "../../../../domain.types/users/patient/goal/goal.dto";
import { GoalSearchFilters, GoalSearchResults } from "../../../../domain.types/users/patient/goal/goal.search.types";

export interface IGoalRepo {

    create(contactDomainModel: GoalDomainModel): Promise<GoalDto>;

    getById(id: string): Promise<GoalDto>;

    getPatientGoals(patientUserId: string): Promise<GoalDto[]>;

    search(filters: GoalSearchFilters): Promise<GoalSearchResults>;

    update(id: string, contactDomainModel: GoalDomainModel): Promise<GoalDto>;

    delete(id: string): Promise<boolean>;

}
