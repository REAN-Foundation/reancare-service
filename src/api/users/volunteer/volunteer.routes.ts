import express from 'express';
import { VolunteerController } from './volunteer.controller';
import { auth } from '../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new VolunteerController();

    router.post('/', controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:userId', auth(), controller.getByUserId);
    router.put('/:userId', auth(), controller.updateByUserId);
    router.delete('/:userId', auth(), controller.delete);

    app.use('/api/v1/volunteers', router);
};
