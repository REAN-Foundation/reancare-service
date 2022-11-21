import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { uuid } from "../../miscellaneous/system.types";
import { ConversationDto } from "./conversation.dto";

export interface ConversationSearchFilters extends BaseSearchFilters {
    OtherUserId?        : uuid;
    CurrentUserId?      : uuid;
    IsGroupconversation?: boolean;
}

export interface ConversationSearchResults extends BaseSearchResults {
    Items: ConversationDto[];
}
