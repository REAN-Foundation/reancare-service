import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DonationController } from './donation.controller';
import { DonationAuth } from './donation.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DonationController();

    router.post('/', auth(DonationAuth.create), controller.create);
    router.get('/search', auth(DonationAuth.search), controller.search);
    router.get('/:id', auth(DonationAuth.getById), controller.getById);
    router.put('/:id', auth(DonationAuth.update), controller.update);
    router.delete('/:id', auth(DonationAuth.delete), controller.delete);

    app.use('/api/v1/clinical/donation-record', router);
};
