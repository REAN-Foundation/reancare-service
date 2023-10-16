import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import { ConversationDto } from '../../../../../domain.types/community/chat/conversation.dto';
import Conversation from '../../models/community/chat/conversation.model';

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
            InitiatingUserId    : conversation.InitiatingUserId,
            OtherUserId         : conversation.OtherUserId,
            OtherUser           : conversation.OtherUser ? {
                id              : conversation.OtherUser.id,
                FirstName       : conversation.OtherUser.Person?.FirstName,
                LastName        : conversation.OtherUser.Person?.LastName,
                Prefix          : conversation.OtherUser.Person?.Prefix,
                DisplayName     : `${conversation.OtherUser.Person?.FirstName} ${conversation.OtherUser.Person?.LastName}`,
                ImageResourceId : conversation.OtherUser.Person?.ImageResourceId,
            } : null,
            InitiatingUser : conversation.InitiatingUser ? {
                id              : conversation.InitiatingUser.id,
                FirstName       : conversation.InitiatingUser.Person?.FirstName,
                LastName        : conversation.InitiatingUser.Person?.LastName,
                Prefix          : conversation.InitiatingUser.Person?.Prefix,
                DisplayName     : `${conversation.InitiatingUser.Person?.FirstName} ${conversation.InitiatingUser.Person?.LastName}`,
                ImageResourceId : conversation.InitiatingUser.Person?.ImageResourceId,
            } : null,
            Topic                : conversation.Topic,
            Users                : users ?? null,
            LastMessageTimestamp : conversation.LastMessageTimestamp,
        };
        return dto;
    };

}
