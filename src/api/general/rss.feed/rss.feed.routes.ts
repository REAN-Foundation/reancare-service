import express from 'express';
import { RssfeedController } from './rss.feed.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new RssfeedController();

    //Public routes
    router.get('/:id/rss', auth('Misc.Rssfeed.GetRssFeed', true), controller.getRssFeed);
    router.get('/:id/atom', auth('Misc.Rssfeed.GetAtomFeed', true), controller.getAtomFeed);
    router.get('/:id/json', auth('Misc.Rssfeed.GetJsonFeed', true), controller.getJsonFeed);

    //Protected routes
    router.post('/', auth('Misc.Rssfeed.Create'), controller.create);
    router.get('/search', auth('Misc.Rssfeed.Search'), controller.search);
    router.get('/:id', auth('Misc.Rssfeed.GetById'), controller.getById);
    router.put('/:id', auth('Misc.Rssfeed.Update'), controller.update);
    router.delete('/:id', auth('Misc.Rssfeed.Delete'), controller.delete);

    router.post('/feed-items', auth('Misc.Rssfeed.AddFeedItem'), controller.addFeedItem);
    router.get('/feed-items/:itemId', auth('Misc.Rssfeed.GetFeedItemById'), controller.getFeedItemById);
    router.put('/feed-items/:itemId', auth('Misc.Rssfeed.UpdateFeedItem'), controller.updateFeedItem);
    router.delete('/feed-items/:itemId', auth('Misc.Rssfeed.DeleteFeedItem'), controller.deleteFeedItem);

    app.use('/api/v1/rss-feeds', router);
};
