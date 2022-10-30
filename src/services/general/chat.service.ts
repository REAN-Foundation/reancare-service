import { inject, injectable } from "tsyringe";
import { IChatRepo } from "../../database/repository.interfaces/general/chat.repo.interface";
import { ConversationDomainModel } from '../../domain.types/general/chat/conversation.domain.model';
import { ConversationDto } from '../../domain.types/general/chat/conversation.dto';
import { ChatMessageDomainModel } from "../../domain.types/general/chat/chat.message.domain.model";
import { ChatMessageDto } from "../../domain.types/general/chat/chat.message.dto";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { ConversationSearchFilters, ConversationSearchResults } from "../../domain.types/general/chat/conversation.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ChatService {

    constructor(
        @inject('IChatRepo') private _chatRepo: IChatRepo,
    ) {}

    startConversation = async (model: ConversationDomainModel): Promise<ConversationDto> => {
        return await this._chatRepo.startConversation(model);
    };

    sendMessage = async (id: ChatMessageDomainModel): Promise<ChatMessageDto> => {
        return await this._chatRepo.sendMessage(id);
    };

    getConversationMessages = async (conversationId: uuid): Promise<ChatMessageDto[]> => {
        return await this._chatRepo.getConversationMessages(conversationId);
    };

    searchUserConversations = async (filters: ConversationSearchFilters): Promise<ConversationSearchResults> => {
        return await this._chatRepo.searchUserConversations(filters);
    };

    getConversationById = async (conversationId: string): Promise<ConversationDto> => {
        return await this._chatRepo.conversationId(conversationId);
    };

    updateConversation = async (conversationId: uuid, updates: ConversationDomainModel): Promise<ConversationDto> => {
        return await this._chatRepo.updateConversation(conversationId, updates);
    };

    deleteConversation = async (conversationId: uuid): Promise<boolean> => {
        return await this._chatRepo.deleteConversation(conversationId);
    };

    getMessage = async (messageId: uuid): Promise<boolean> => {
        return await this._chatRepo.getMessage(messageId);
    };

    updateMessage = async (messageId: uuid, updates: ChatMessageDomainModel): Promise<ChatMessageDto> => {
        return await this._chatRepo.updateMessage(messageId, updates);
    };

    deleteMessage = async (messageId: uuid): Promise<boolean> => {
        return await this._chatRepo.deleteMessage(messageId);
    };

}
