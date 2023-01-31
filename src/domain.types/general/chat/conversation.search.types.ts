import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { ConversationDto } from "./conversation.dto";

export interface ConversationSearchFilters extends BaseSearchFilters {
    IsGroupconversation?: boolean;
    Topic? : string;
    Marked? : boolean;
}

export interface ConversationSearchResults extends BaseSearchResults {
    Items: ConversationDto[];
}
