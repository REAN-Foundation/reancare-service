import { Op } from 'sequelize';
import { ChatMessageDomainModel } from '../../../../../domain.types/community/chat/chat.message.domain.model';
import { ChatMessageDto } from '../../../../../domain.types/community/chat/chat.message.dto';
import { ConversationDomainModel } from '../../../../../domain.types/community/chat/conversation.domain.model';
import { ConversationDto } from '../../../../../domain.types/community/chat/conversation.dto';
import { ConversationSearchFilters, ConversationSearchResults } from '../../../../../domain.types/community/chat/conversation.search.types';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { IChatRepo } from '../../../../repository.interfaces/community/chat.repo.interface';
import Conversation from '../../models/community/chat/conversation.model';
import ChatMessage from '../../models/community/chat/chat.message.model';
import ConversationParticipant from '../../models/community/chat/conversation.participant.model';
import { ChatMapper } from '../../mappers/community/chat.mapper';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import User from '../../models/users/user/user.model';
import Person from '../../models/person/person.model';

///////////////////////////////////////////////////////////////////////

export class ChatRepo implements IChatRepo {

    startConversation = async (model: ConversationDomainModel): Promise<ConversationDto> => {
        try {
            if (!model.IsGroupConversation &&
                model.OtherUserId != null) {

                //This is one-2-one conversation
                //Obtain existing conversation between these 2 users

                const existing = await Conversation.findOne({
                    where : {
                        [Op.or] : [
                            {
                                InitiatingUserId : model.InitiatingUserId,
                                OtherUserId      : model.OtherUserId,
                            },
                            {
                                InitiatingUserId : model.OtherUserId,
                                OtherUserId      : model.InitiatingUserId,
                            },
                        ]
                    },
                    include : this.includeUserDetails(),
                });
                if (existing) {
                    //Found, return the existing...
                    return ChatMapper.toDto(existing);
                }
            }
            const entity = {
                IsGroupConversation : model.IsGroupConversation ?? false,
                Marked              : model.Marked ?? false,
                InitiatingUserId    : model.InitiatingUserId ?? null,
                OtherUserId         : model.OtherUserId ?? null,
                Topic               : model.Topic ?? null,
            };
            const conversation = await Conversation.create(entity);
            var participants = null;
            if (model.IsGroupConversation && model.Users.length > 0) {
                participants = [];
                for await (var userId of model.Users) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const participant = await ConversationParticipant.create({
                        ConversationId : conversation.id,
                        UserId         : userId,
                    });
                    participants.push(userId);
                }
            }
            return await this.getConversationById(conversation.id);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    sendMessage = async (model: ChatMessageDomainModel): Promise<ChatMessageDto> => {
        try {
            const entity = {
                SenderId       : model.SenderId,
                ConversationId : model.ConversationId,
                Message        : model.Message,
            };
            const message = await ChatMessage.create(entity);

            //Update last message timestamp
            const conversation = await Conversation.findByPk(model.ConversationId);
            if (conversation) {
                conversation.LastMessageTimestamp = new Date();
            }
            await conversation.save();

            return message;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getConversationMessages = async (conversationId: uuid): Promise<ChatMessageDto[]> => {
        try {
            const messages = await ChatMessage.findAll({
                where : {
                    ConversationId : conversationId
                },
                order : [['CreatedAt', 'DESC']],
                limit : 100
            });
            return messages;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    searchUserConversations = async (userId:uuid, filters: ConversationSearchFilters)
        : Promise<ConversationSearchResults> => {
        try {
            var conditions = [
                {
                    InitiatingUserId : userId,
                },
                {
                    OtherUserId : userId,
                },
            ];

            var search = {
                where : {
                    [Op.or] : conditions,
                },
                include : this.includeUserDetails(),
            };

            if (filters.Topic != null) {
                search.where['Topic'] =  filters.Topic ;

            }
            if (filters.Marked != null) {
                search.where['Marked'] = filters.Marked;

            }
            if (filters.IsGroupconversation != null) {
                search.where['IsGroupconversation'] = filters.IsGroupconversation;

            }
            
            const { pageIndex, limit, order, orderByColum } = this.updateSearch(filters, search);
            const foundResults = await Conversation.findAndCountAll(search);
            const dtos = foundResults.rows.map(x => ChatMapper.toDto(x));
            const searchResults: ConversationSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };
            return searchResults;
           
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getConversationById = async (conversationId: uuid): Promise<ConversationDto> => {
        try {
            const conversation = await Conversation.findOne({
                where : {
                    id : conversationId
                },
                include : this.includeUserDetails(),
            });
            let userIds = [];
            if (conversation.IsGroupConversation) {
                const participants = await ConversationParticipant.findAll({
                    where : {
                        ConversationId : conversationId
                    }
                });
                userIds = participants.map(x => x.UserId);
            }
            return ChatMapper.toDto(conversation, userIds);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateConversation = async (conversationId: string, updates: ConversationDomainModel)
        : Promise<ConversationDto> => {
        try {
            let conversation = await Conversation.findOne({
                where : {
                    id : conversationId
                }
            });
            if (updates.Topic) {
                conversation.Topic = updates.Topic;
            }
            if (updates.Marked != null) {
                conversation.Marked = updates.Marked;
            }
            conversation = await conversation.save();
            const participants = await ConversationParticipant.findAll({
                where : {
                    ConversationId : conversationId
                }
            });
            const userIds = participants.map(x => x.UserId);
            return ChatMapper.toDto(conversation, userIds);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addUserToConversation = async (conversationId: string, userId: uuid)
        : Promise<boolean> => {
        try {
            const participant = await ConversationParticipant.findOne({
                where : {
                    ConversationId : conversationId,
                    UserId         : userId,
                }
            });
            if (participant) {
                throw new ApiError(422, 'The participant is already part of the conversation!');
            }
            const newParticipant = await ConversationParticipant.create({
                where : {
                    ConversationId : conversationId,
                    UserId         : userId,
                }
            });
            if (newParticipant) {
                return true;
            }
            return false;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    removeUserFromConversation = async (conversationId: string, userId: uuid)
        : Promise<boolean> => {
        try {
            const participant = await ConversationParticipant.findOne({
                where : {
                    ConversationId : conversationId,
                    UserId         : userId,
                }
            });
            if (!participant) {
                throw new ApiError(422, 'The participant is not part of the conversation!');
            }
            const deleted = await ConversationParticipant.destroy({
                where : {
                    ConversationId : conversationId,
                    UserId         : userId,
                }
            });
            return deleted > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getConversationBetweenTwoUsers = async (firstUserId: uuid, secondUserId: uuid)
    : Promise<ConversationDto>  => {
        try {
            const existing = await Conversation.findOne({
                where : {
                    [Op.or] : [
                        {
                            InitiatingUserId : firstUserId,
                            OtherUserId      : secondUserId,
                        },
                        {
                            InitiatingUserId : secondUserId,
                            OtherUserId      : firstUserId,
                        },
                    ]
                },
                include : this.includeUserDetails(),
            });
            if (existing) {
                //Found, return the existing...
                return ChatMapper.toDto(existing);
            }
            return null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteConversation = async (conversationId: string): Promise<boolean> => {
        try {
            const totalDeleted = await ConversationParticipant.destroy({
                where : {
                    ConversationId : conversationId
                }
            });
            Logger.instance().log(`Participants deleted: ${totalDeleted}`);
            const deleted = await Conversation.destroy({
                where : {
                    id : conversationId
                }
            });
            return deleted > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getMessage = async (messageId: string): Promise<ChatMessageDto> => {
        try {
            const message = await ChatMessage.findByPk(messageId);
            const dto: ChatMessageDto = {
                id             : message.id,
                ConversationId : message.ConversationId,
                Message        : message.Message,
                SenderId       : message.SenderId
            };
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateMessage = async (messageId: string, updates: ChatMessageDomainModel): Promise<ChatMessageDto> => {
        try {
            let message = await ChatMessage.findOne({
                where : {
                    id : messageId
                }
            });
            if (updates.Message) {
                message.Message = updates.Message;
            }
            message = await message.save();
            const dto: ChatMessageDto = {
                id             : message.id,
                ConversationId : message.ConversationId,
                Message        : message.Message,
                SenderId       : message.SenderId
            };
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteMessage = async (messageId: string): Promise<boolean> => {
        try {
            const deleted = await ChatMessage.destroy({
                where : {
                    id : messageId
                }
            });
            return deleted > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getMarkedConversationsForUser = async (userId: string): Promise<ConversationDto[]> => {
        try {
            const conversations = await Conversation.findAll({
                where : {
                    Marked  : true,
                    [Op.or] : [
                        {
                            InitiatingUserId : userId,
                        },
                        {
                            OtherUserId : userId,
                        },
                    ]
                },
                include : this.includeUserDetails(),
                order   : [['CreatedAt', 'DESC']],
                limit   : 15,
                offset  : 0,
            });
            return conversations.map(x => ChatMapper.toDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getRecentConversationsForUser = async (userId: string): Promise<ConversationDto[]> => {
        try {
            const conversations = await Conversation.findAll({
                where : {
                    [Op.or] : [
                        {
                            InitiatingUserId : userId,
                        },
                        {
                            OtherUserId : userId,
                        },
                    ]
                },
                include : this.includeUserDetails(),
                order   : [['LastMessageTimestamp', 'DESC']],
                limit   : 15,
                offset  : 0,
            });
            return conversations.map(x => ChatMapper.toDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    //#region Privates

    private updateSearch = (filters: ConversationSearchFilters, search: any) => {
        if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
            search.where['CreatedAt'] = {
                [Op.gte] : filters.CreatedDateFrom,
                [Op.lte] : filters.CreatedDateTo,
            };
        } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
            search.where['CreatedAt'] = {
                [Op.lte] : filters.CreatedDateTo,
            };
        } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
            search.where['CreatedAt'] = {
                [Op.gte] : filters.CreatedDateFrom,
            };
        }
        let orderByColum = 'CreatedAt';
        if (filters.OrderBy) {
            orderByColum = filters.OrderBy;
        }
        let order = 'ASC';
        if (filters.Order === 'descending') {
            order = 'DESC';
        }
        search['order'] = [[orderByColum, order]];

        let limit = 25;
        if (filters.ItemsPerPage) {
            limit = filters.ItemsPerPage;
        }
        let offset = 0;
        let pageIndex = 0;
        if (filters.PageIndex) {
            pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
            offset = pageIndex * limit;
        }
        search['limit'] = limit;
        search['offset'] = offset;
        return { pageIndex, limit, order, orderByColum };
    };

    private includeUserDetails() {
        return [
            {
                model    : User,
                as       : 'OtherUser',
                required : true,
                include  : [
                    {
                        model    : Person,
                        as       : 'Person',
                        required : true
                    }
                ]
            },
            {
                model    : User,
                as       : 'InitiatingUser',
                required : true,
                include  : [
                    {
                        model    : Person,
                        as       : 'Person',
                        required : true
                    }
                ]
            }
        ];
    }
    //#endregion

}
