import { inject, injectable } from "tsyringe";
import { IChatRepo } from "../../database/repository.interfaces/community/chat.repo.interface";
import { ConversationDomainModel } from '../../domain.types/community/chat/conversation.domain.model';
import { ConversationDto } from '../../domain.types/community/chat/conversation.dto';
import { ChatMessageDomainModel } from "../../domain.types/community/chat/chat.message.domain.model";
import { ChatMessageDto } from "../../domain.types/community/chat/chat.message.dto";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { ConversationSearchFilters, ConversationSearchResults } from "../../domain.types/community/chat/conversation.search.types";

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

    searchUserConversations = async (userId: string, filters: ConversationSearchFilters)
        : Promise<ConversationSearchResults> => {
        return await this._chatRepo.searchUserConversations(userId, filters);
    };

    getConversationById = async (conversationId: string): Promise<ConversationDto> => {
        return await this._chatRepo.getConversationById(conversationId);
    };

    updateConversation = async (conversationId: uuid, updates: ConversationDomainModel): Promise<ConversationDto> => {
        return await this._chatRepo.updateConversation(conversationId, updates);
    };

    deleteConversation = async (conversationId: uuid): Promise<boolean> => {
        return await this._chatRepo.deleteConversation(conversationId);
    };

    addUserToConversation = async (conversationId: uuid, userId: uuid): Promise<boolean> => {
        return await this._chatRepo.addUserToConversation(conversationId, userId);
    };

    removeUserFromConversation = async (conversationId: uuid, userId: uuid): Promise<boolean> => {
        return await this._chatRepo.removeUserFromConversation(conversationId, userId);
    };

    getConversationBetweenTwoUsers = async (firstUserId: uuid, secondUserId: uuid): Promise<ConversationDto> => {
        return await this._chatRepo.getConversationBetweenTwoUsers(firstUserId, secondUserId);
    };

    getMessage = async (messageId: uuid): Promise<ChatMessageDto> => {
        return await this._chatRepo.getMessage(messageId);
    };

    updateMessage = async (messageId: uuid, updates: ChatMessageDomainModel): Promise<ChatMessageDto> => {
        return await this._chatRepo.updateMessage(messageId, updates);
    };

    deleteMessage = async (messageId: uuid): Promise<boolean> => {
        return await this._chatRepo.deleteMessage(messageId);
    };

    getMarkedConversationsForUser = async (userId: uuid): Promise<ConversationDto[]> => {
        return await this._chatRepo.getMarkedConversationsForUser(userId);
    };

    getRecentConversationsForUser = async (userId: uuid): Promise<ConversationDto[]> => {
        return await this._chatRepo.getRecentConversationsForUser(userId);
    };

}
