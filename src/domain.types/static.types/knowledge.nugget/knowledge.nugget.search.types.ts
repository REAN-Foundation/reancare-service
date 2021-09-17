import { KnowledgeNuggetDto } from "./knowledge.nugget.dto";

//////////////////////////////////////////////////////////////////////

export interface KnowledgeNuggetSearchFilters {
    TopicName?: string;
    Tag?: string;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface KnowledgeNuggetSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: KnowledgeNuggetDto[];
}
