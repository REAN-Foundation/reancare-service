import { KnowledgeNuggetDomainModel } from "../../../domain.types/static.types/knowledge.nugget/knowledge.nugget.domain.model";
import { KnowledgeNuggetDto } from "../../../domain.types/static.types/knowledge.nugget/knowledge.nugget.dto";
import { KnowledgeNuggetSearchFilters, KnowledgeNuggetSearchResults } from "../../../domain.types/static.types/knowledge.nugget/knowledge.nugget.search.types";

export interface IKnowledgeNuggetRepo {

    create(knowledgeNuggetDomainModel: KnowledgeNuggetDomainModel): Promise<KnowledgeNuggetDto>;

    getById(id: string): Promise<KnowledgeNuggetDto>;
    
    search(filters: KnowledgeNuggetSearchFilters): Promise<KnowledgeNuggetSearchResults>;

    update(id: string, knowledgeNuggetDomainModel: KnowledgeNuggetDomainModel):
    Promise<KnowledgeNuggetDto>;

    delete(id: string): Promise<boolean>;

}
