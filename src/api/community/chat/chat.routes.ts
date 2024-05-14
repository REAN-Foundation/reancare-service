import express from 'express';
import { ChatController } from './chat.controller';
import { auth } from '../../../auth/auth.handler';
import { ChatAuth } from './chat.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ChatController();

    router.post('/conversations/start', auth(ChatAuth.startConversation), controller.startConversation);
    router.post('/conversations/:conversationId/messages', auth(ChatAuth.sendMessage), controller.sendMessage);
    router.post('/conversations/:conversationId/users/:userId/add', auth(ChatAuth.addUserToConversation), controller.addUserToConversation);
    router.post('/conversations/:conversationId/users/:userId/remove', auth(ChatAuth.removeUserFromConversation), controller.removeUserFromConversation);
    router.get('/conversations/first-user/:firstUserId/second-user/:secondUserId', auth(ChatAuth.getConversationBetweenTwoUsers), controller.getConversationBetweenTwoUsers);
    router.get('/users/:userId/conversations/marked', auth(ChatAuth.getMarkedConversationsForUser), controller.getMarkedConversationsForUser);
    router.get('/users/:userId/conversations/recent', auth(ChatAuth.getRecentConversationsForUser), controller.getRecentConversationsForUser);
    router.get('/conversations/:conversationId/messages', auth(ChatAuth.getConversationMessages), controller.getConversationMessages);
    router.get('/users/:userId/conversations/search', auth(ChatAuth.searchUserConversations), controller.searchUserConversations);
    router.get('/conversations/:conversationId', auth(ChatAuth.getConversationById), controller.getConversationById);
    router.put('/conversations/:conversationId', auth(ChatAuth.updateConversation), controller.updateConversation);
    router.delete('/conversations/:conversationId', auth(ChatAuth.deleteConversation), controller.deleteConversation);
    router.get('/messages/:messageId', auth(ChatAuth.getMessage), controller.getMessage);
    router.put('/messages/:messageId', auth(ChatAuth.updateMessage), controller.updateMessage);
    router.delete('/messages/:messageId', auth(ChatAuth.deleteMessage), controller.deleteMessage);

    app.use('/api/v1/chats', router);
};
