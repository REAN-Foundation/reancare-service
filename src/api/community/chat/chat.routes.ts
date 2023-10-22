import express from 'express';
import { ChatController } from './chat.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ChatController();

    router.post('/conversations/start', auth('Community.Chat.StartConversation'), controller.startConversation);
    router.post('/conversations/:conversationId/messages', auth('Community.Chat.SendMessage'), controller.sendMessage);
    router.post('/conversations/:conversationId/users/:userId/add', auth('Community.Chat.AddUserToConversation'), controller.addUserToConversation);
    router.post('/conversations/:conversationId/users/:userId/remove', auth('Community.Chat.RemoveUserFromConversation'), controller.removeUserFromConversation);
    router.get('/conversations/first-user/:firstUserId/second-user/:secondUserId', auth('Community.Chat.GetConversationBetweenTwoUsers'), controller.getConversationBetweenTwoUsers);
    router.get('/users/:userId/conversations/marked', auth('Community.Chat.GetMarkedConversationsForUser'), controller.getMarkedConversationsForUser);
    router.get('/users/:userId/conversations/recent', auth('Community.Chat.GetRecentConversationsForUser'), controller.getRecentConversationsForUser);
    router.get('/conversations/:conversationId/messages', auth('Community.Chat.GetConversationMessages'), controller.getConversationMessages);
    router.get('/users/:userId/conversations/search', auth('Community.Chat.SearchUserConversations'), controller.searchUserConversations);
    router.get('/conversations/:conversationId', auth('Community.Chat.GetConversationById'), controller.getConversationById);
    router.put('/conversations/:conversationId', auth('Community.Chat.UpdateConversation'), controller.updateConversation);
    router.delete('/conversations/:conversationId', auth('Community.Chat.DeleteConversation'), controller.deleteConversation);
    router.get('/messages/:messageId', auth('Community.Chat.GetMessage'), controller.getMessage);
    router.put('/messages/:messageId', auth('Community.Chat.UpdateMessage'), controller.updateMessage);
    router.delete('/messages/:messageId', auth('Community.Chat.DeleteMessage'), controller.deleteMessage);

    app.use('/api/v1/chats', router);
};
