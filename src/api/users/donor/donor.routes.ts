import express from 'express';
import { DonorController } from './donor.controller';
import { auth } from '../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DonorController();

    router.post('/', controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:userId', auth(), controller.getByUserId);
    router.put('/:userId', auth(), controller.updateByUserId);
    router.delete('/:userId', auth(), controller.delete);

    app.use('/api/v1/donors', router);
};
