import { inject, injectable } from "tsyringe";
import { IChatRepo } from "../../../database/repository.interfaces/general/chat.repo.interface";
import { ChatDomainModel } from '../../../../../domain.types/general/chat/chat.domain.model';
import { ChatDto } from '../../domain.types/general/chat/chat.dto';
import { ChatSearchResults, ChatSearchFilters } from '../../domain.types/general/chat/chat.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ChatService {

    constructor(
        @inject('IChatRepo') private _chatRepo: IChatRepo,
    ) {}

    create = async (chatDomainModel: ChatDomainModel): Promise<ChatDto> => {
        return await this._chatRepo.create(chatDomainModel);
    };

    getById = async (id: string): Promise<ChatDto> => {
        return await this._chatRepo.getById(id);
    };

    search = async (filters: ChatSearchFilters): Promise<ChatSearchResults> => {
        return await this._chatRepo.search(filters);
    };

    update = async (id: string, chatDomainModel: ChatDomainModel): Promise<ChatDto> => {
        return await this._chatRepo.update(id, chatDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._chatRepo.delete(id);
    };

}
