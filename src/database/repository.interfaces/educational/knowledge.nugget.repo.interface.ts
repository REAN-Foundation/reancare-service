import { KnowledgeNuggetDomainModel } from "../../../domain.types/educational/knowledge.nugget/knowledge.nugget.domain.model";
import { KnowledgeNuggetDto } from "../../../domain.types/educational/knowledge.nugget/knowledge.nugget.dto";
import { KnowledgeNuggetSearchFilters, KnowledgeNuggetSearchResults } from "../../../domain.types/educational/knowledge.nugget/knowledge.nugget.search.types";

export interface IKnowledgeNuggetRepo {

    getRandom(): Promise<KnowledgeNuggetDto>;

    create(knowledgeNuggetDomainModel: KnowledgeNuggetDomainModel): Promise<KnowledgeNuggetDto>;

    getById(id: string): Promise<KnowledgeNuggetDto>;
    
    search(filters: KnowledgeNuggetSearchFilters): Promise<KnowledgeNuggetSearchResults>;

    update(id: string, knowledgeNuggetDomainModel: KnowledgeNuggetDomainModel):
    Promise<KnowledgeNuggetDto>;

    delete(id: string): Promise<boolean>;

    totalCount(): Promise<number>;

}
