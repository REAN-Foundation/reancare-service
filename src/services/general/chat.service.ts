import { inject, injectable } from "tsyringe";
import { IChatRepo } from "../../../database/repository.interfaces/general/chat.repo.interface";
import { ConversationDomainModel } from '../../domain.types/general/chat/conversation.domain.model';
import { ConversationDto } from '../../domain.types/general/chat/conversation.dto';
import { CoversationSearchFfilters } from '../../domain.types/general/chat/conversation.search.filters';
import { ChatMessageDomainModel } from "../../domain.types/general/chat/chat.message.domain.model";
import { ChatMessageDto } from "../../domain.types/general/chat/chat.message.dto";
import { uuid } from "../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ChatService {

    constructor(
        @inject('IChatRepo') private _chatRepo: IChatRepo,
    ) {}

    startConversation = async (model: ConversationDomainModel): Promise<ConversationDto> => {
        return await this._chatRepo.create(model);
    };

    sendMessage = async (id: ChatMessageDomainModel): Promise<ChatMessageDto> => {
        return await this._chatRepo.sendMessage(id);
    };

    getConversationMessages = async (conversationId: uuid): Promise<ChatMessageDto[]> => {
        return await this._chatRepo.getConversationMessages(conversationId);
    };

    searchUserConversations = async (userId: uuid, filters: ConversationSearchFilters): Promise<ConversationDto[]> => {
        return await this._chatRepo.searchUserConversations(userId, filters);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._chatRepo.delete(id);
    };

}
