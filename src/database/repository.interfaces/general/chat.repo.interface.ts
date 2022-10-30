import { ConversationDomainModel } from "../../../domain.types/general/chat/conversation.domain.model";
import { ConversationDto } from "../../../domain.types/general/chat/conversation.dto";
import { ChatMessageDomainModel } from "../../../domain.types/general/chat/chat.message.domain.model";
import { ChatMessageDto } from "../../../domain.types/general/chat/chat.message.dto";
import { ConversationSearchFilters, ConversationSearchResults } from "../../../domain.types/general/chat/conversation.search.types";

export interface IChatRepo {

    startConversation(model: ConversationDomainModel): Promise<ConversationDto>;

    sendMessage(id: ChatMessageDomainModel): Promise<ChatMessageDto>;

    getConversationMessages(conversationId: string): Promise<ChatMessageDto[]>;

    searchUserConversations(filters: ConversationSearchFilters): Promise<ConversationSearchResults>;

    conversationId(conversationId: string): Promise<ConversationDto>;

    updateConversation(conversationId: string, updates: ConversationDomainModel): Promise<ConversationDto>;

    deleteConversation(conversationId: string): Promise<boolean>;

    getMessage(messageId: string): Promise<boolean>;

    updateMessage(messageId: string, updates: ChatMessageDomainModel): Promise<ChatMessageDto>;

    deleteMessage(messageId: string): Promise<boolean>;
}
