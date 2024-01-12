import express from 'express';
import { RssfeedController } from './rss.feed.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new RssfeedController();

    //Public routes
    router.get('/:id/rss', auth('Community.Rssfeed.GetRssFeed', true), controller.getRssFeed);
    router.get('/:id/atom', auth('Community.Rssfeed.GetAtomFeed', true), controller.getAtomFeed);
    router.get('/:id/json', auth('Community.Rssfeed.GetJsonFeed', true), controller.getJsonFeed);

    //Protected routes
    router.post('/', auth('Community.Rssfeed.Create'), controller.create);
    router.get('/search', auth('Community.Rssfeed.Search'), controller.search);
    router.get('/:id', auth('Community.Rssfeed.GetById'), controller.getById);
    router.put('/:id', auth('Community.Rssfeed.Update'), controller.update);
    router.delete('/:id', auth('Community.Rssfeed.Delete'), controller.delete);

    router.post('/feed-items', auth('Community.Rssfeed.AddFeedItem'), controller.addFeedItem);
    router.get('/feed-items/:itemId', auth('Community.Rssfeed.GetFeedItemById'), controller.getFeedItemById);
    router.put('/feed-items/:itemId', auth('Community.Rssfeed.UpdateFeedItem'), controller.updateFeedItem);
    router.delete('/feed-items/:itemId', auth('Community.Rssfeed.DeleteFeedItem'), controller.deleteFeedItem);

    app.use('/api/v1/rss-feeds', router);
};
