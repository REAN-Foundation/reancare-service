import { GoalTypeDomainModel } from "../../../../domain.types/users/patient/goal.type/goal.type.domain.model";
import { GoalTypeDto } from "../../../../domain.types/users/patient/goal.type/goal.type.dto";
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

    createGoalType(goalTypeDomainModel: GoalTypeDomainModel): Promise<GoalTypeDto>;

    getGoalTypeById(id: string): Promise<GoalTypeDto>;

    getGoalTypes(tags?: string): Promise<GoalTypeDto[]>;

    updateGoalType(id: string, goalTypeDomainModel: GoalTypeDomainModel):
     Promise<GoalTypeDto>;

    deleteGoalType(id: string): Promise<boolean>;

}
