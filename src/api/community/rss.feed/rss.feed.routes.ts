import express from 'express';
import { RssfeedController } from './rss.feed.controller';
import { auth } from '../../../auth/auth.handler';
import { RssFeedAuth } from './rss.feed.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new RssfeedController();

    //Public routes
    router.get('/:id/rss', auth(RssFeedAuth.getRssFeed), controller.getRssFeed);
    router.get('/:id/atom', auth(RssFeedAuth.getAtomFeed), controller.getAtomFeed);
    router.get('/:id/json', auth(RssFeedAuth.getJsonFeed), controller.getJsonFeed);

    //Protected routes
    router.post('/', auth(RssFeedAuth.create), controller.create);
    router.get('/search', auth(RssFeedAuth.search), controller.search);
    router.get('/:id', auth(RssFeedAuth.getById), controller.getById);
    router.put('/:id', auth(RssFeedAuth.update), controller.update);
    router.delete('/:id', auth(RssFeedAuth.delete), controller.delete);

    router.post('/feed-items', auth(RssFeedAuth.addFeedItem), controller.addFeedItem);
    router.get('/feed-items/:itemId', auth(RssFeedAuth.getFeedItemById), controller.getFeedItemById);
    router.put('/feed-items/:itemId', auth(RssFeedAuth.updateFeedItem), controller.updateFeedItem);
    router.delete('/feed-items/:itemId', auth(RssFeedAuth.deleteFeedItem), controller.deleteFeedItem);

    app.use('/api/v1/rss-feeds', router);
};
