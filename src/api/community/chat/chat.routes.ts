import express from 'express';
import { ChatController } from './chat.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ChatController();

    router.post('/conversations/start', auth('Chat.StartConversation'), controller.startConversation);
    router.post('/conversations/:conversationId/messages', auth('Chat.SendMessage'), controller.sendMessage);
    router.post('/conversations/:conversationId/users/:userId/add', auth('Chat.AddUserToConversation'), controller.addUserToConversation);
    router.post('/conversations/:conversationId/users/:userId/remove', auth('Chat.RemoveUserFromConversation'), controller.removeUserFromConversation);
    router.get('/conversations/first-user/:firstUserId/second-user/:secondUserId', auth('Chat.GetConversationBetweenTwoUsers'), controller.getConversationBetweenTwoUsers);
    router.get('/users/:userId/conversations/marked', auth('Chat.GetMarkedConversationsForUser'), controller.getMarkedConversationsForUser);
    router.get('/users/:userId/conversations/recent', auth('Chat.GetRecentConversationsForUser'), controller.getRecentConversationsForUser);
    router.get('/conversations/:conversationId/messages', auth('Chat.GetConversationMessages'), controller.getConversationMessages);
    router.get('/users/:userId/conversations/search', auth('Chat.SearchUserConversations'), controller.searchUserConversations);
    router.get('/conversations/:conversationId', auth('Chat.GetConversationById'), controller.getConversationById);
    router.put('/conversations/:conversationId', auth('Chat.UpdateConversation'), controller.updateConversation);
    router.delete('/conversations/:conversationId', auth('Chat.DeleteConversation'), controller.deleteConversation);
    router.get('/messages/:messageId', auth('Chat.GetMessage'), controller.getMessage);
    router.put('/messages/:messageId', auth('Chat.UpdateMessage'), controller.updateMessage);
    router.delete('/messages/:messageId', auth('Chat.DeleteMessage'), controller.deleteMessage);

    app.use('/api/v1/chats', router);
};
