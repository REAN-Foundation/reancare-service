import express from 'express';
import { ChatController } from './chat.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ChatController();

    router.post('/conversations/start', auth(), controller.startConversation);
    router.post('/conversations/:conversationId/messages', auth(), controller.sendMessage);
    router.post('/conversations/:conversationId/users/:userId/add', auth(), controller.addUserToConversation);
    router.post('/conversations/:conversationId/users/:userId/remove', auth(), controller.removeUserFromConversation);
    router.get('/conversations/first-user/:firstUserId/second-user/:secondUserId', auth(), controller.getConversationBetweenTwoUsers);
    router.get('/users/:userId/conversations/marked', auth(), controller.getMarkedConversationsForUser);
    router.get('/users/:userId/conversations/recent', auth(), controller.getRecentConversationsForUser);
    router.get('/conversations/:conversationId/messages', auth(), controller.getConversationMessages);
    router.get('/users/:userId/conversations/search', auth(), controller.searchUserConversations);
    router.get('/conversations/:conversationId', auth(), controller.getConversationById);
    router.put('/conversations/:conversationId', auth(), controller.updateConversation);
    router.delete('/conversations/:conversationId', auth(), controller.deleteConversation);
    router.get('/messages/:messageId', auth(), controller.getMessage);
    router.put('/messages/:messageId', auth(), controller.updateMessage);
    router.delete('/messages/:messageId', auth(), controller.deleteMessage);

    app.use('/api/v1/chats', router);
};
