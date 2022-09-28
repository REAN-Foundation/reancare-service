
import { LearningPathDomainModel } from "../../../../domain.types/educational/learning/learning.path/learning.path.domain.model";
import { LearningPathDto } from "../../../../domain.types/educational/learning/learning.path/learning.path.dto";
import { LearningPathSearchFilters,
    LearningPathSearchResults } from "../../../../domain.types/educational/learning/learning.path/learning.path.search.types";

export interface ILearningPathRepo {

    create(courseDomainModel: LearningPathDomainModel): Promise<LearningPathDto>;

    getById(id: string): Promise<LearningPathDto>;

    search(filters: LearningPathSearchFilters): Promise<LearningPathSearchResults>;

    update(id: string, courseDomainModel: LearningPathDomainModel): Promise<LearningPathDto>;

    delete(id: string): Promise<boolean>;

}
