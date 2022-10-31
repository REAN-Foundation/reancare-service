import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import { ConversationDto } from '../../../../../domain.types/general/chat/conversation.dto';
import Conversation from '../../models/general/chat/conversation.model';

///////////////////////////////////////////////////////////////////////////////////

export class ChatMapper {

    static toDto = (conversation: Conversation, users?: uuid[]): ConversationDto => {
        if (conversation == null){
            return null;
        }

        const dto: ConversationDto = {
            id                  : conversation.id,
            IsGroupConversation : conversation.IsGroupConversation,
            Marked              : conversation.Marked,
            StartedByUserId     : conversation.StartedByUserId,
            Topic               : conversation.Topic,
            Users               : users ?? null,
        };
        return dto;
    };

}
