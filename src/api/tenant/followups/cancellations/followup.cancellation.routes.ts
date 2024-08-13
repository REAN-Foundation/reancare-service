import express from 'express';
import { FollowUpCancellationController } from './followup.cancellation.controller';
import { FollowUpCancellationAuth } from './followup.cancellation.auth';
import { auth } from '../../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FollowUpCancellationController();

    router.post('/', auth(FollowUpCancellationAuth.create), controller.create);
    router.get('/search', auth(FollowUpCancellationAuth.search), controller.search);
    router.get('/:id', auth(FollowUpCancellationAuth.getById), controller.getById);
    router.put('/:id', auth(FollowUpCancellationAuth.update), controller.update);
    router.delete('/:id', auth(FollowUpCancellationAuth.delete), controller.delete);

    app.use('/api/v1/follow-up/cancellations', router);
};
