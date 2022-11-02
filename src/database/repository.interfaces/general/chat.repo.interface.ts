import { ConversationDomainModel } from "../../../domain.types/general/chat/conversation.domain.model";
import { ConversationDto } from "../../../domain.types/general/chat/conversation.dto";
import { ChatMessageDomainModel } from "../../../domain.types/general/chat/chat.message.domain.model";
import { ChatMessageDto } from "../../../domain.types/general/chat/chat.message.dto";
import { ConversationSearchFilters, ConversationSearchResults } from "../../../domain.types/general/chat/conversation.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface IChatRepo {

    startConversation(model: ConversationDomainModel): Promise<ConversationDto>;

    sendMessage(model: ChatMessageDomainModel): Promise<ChatMessageDto>;

    getConversationMessages(conversationId: uuid): Promise<ChatMessageDto[]>;

    searchUserConversations(filters: ConversationSearchFilters): Promise<ConversationSearchResults>;

    getConversationById(conversationId: uuid): Promise<ConversationDto>;

    updateConversation(conversationId: uuid, updates: ConversationDomainModel): Promise<ConversationDto>;

    deleteConversation(conversationId: uuid): Promise<boolean>;

    addUserToConversation(conversationId: uuid, userId: uuid): Promise<boolean>;

    removeUserFromConversation(conversationId: uuid, userId: uuid): Promise<boolean>;

    getConversationBetweenTwoUsers(firstUserId: uuid, secondUserId: uuid): Promise<ConversationDto>;

    getMessage(messageId: uuid): Promise<ChatMessageDto>;

    updateMessage(messageId: uuid, updates: ChatMessageDomainModel): Promise<ChatMessageDto>;

    deleteMessage(messageId: uuid): Promise<boolean>;
}
