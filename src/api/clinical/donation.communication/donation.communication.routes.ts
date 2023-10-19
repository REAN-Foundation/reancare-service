import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { DonationCommunicationController } from './donation.communication.controller';
///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DonationCommunicationController();

    router.post('/', auth('DonationCommunication.Create'), controller.create);
    router.get('/search', auth('DonationCommunication.Search'), controller.search);
    router.get('/:id', auth('DonationCommunication.GetById'), controller.getById);
    router.put('/:id', auth('DonationCommunication.Update'), controller.update);
    router.delete('/:id', auth('DonationCommunication.Delete'), controller.delete);

    app.use('/api/v1/clinical/donation-communication', router);
};
