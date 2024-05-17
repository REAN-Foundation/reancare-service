import express from 'express';
import { DonorController } from './donor.controller';
import { auth } from '../../../../auth/auth.handler';
import { DonorAuth } from './donor.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DonorController();

    router.post('/', auth(DonorAuth.create), controller.create);
    router.get('/search', auth(DonorAuth.search), controller.search);
    router.get('/:userId', auth(DonorAuth.getByUserId), controller.getByUserId);
    router.put('/:userId', auth(DonorAuth.updateByUserId), controller.updateByUserId);
    router.delete('/:userId', auth(DonorAuth.deleteByUserId), controller.delete);

    app.use('/api/v1/donors', router);
};
