import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DonationController } from './donation.controller';
///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DonationController();

    router.post('/', auth('Donation.Create'), controller.create);
    router.get('/search', auth('Donation.Search'), controller.search);
    router.get('/:id', auth('Donation.GetById'), controller.getById);
    router.put('/:id', auth('Donation.Update'), controller.update);
    router.delete('/:id', auth('Donation.Delete'), controller.delete);

    app.use('/api/v1/clinical/donation-record', router);
};
