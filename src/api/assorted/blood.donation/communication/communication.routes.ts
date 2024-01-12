import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CommunicationController } from './communication.controller';
///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CommunicationController();

    router.post('/', auth('Assorted.BloodDonation.Communication.Create'), controller.create);
    router.get('/search', auth('Assorted.BloodDonation.Communication.Search'), controller.search);
    router.get('/:id', auth('Assorted.BloodDonation.Communication.GetById'), controller.getById);
    router.put('/:id', auth('Assorted.BloodDonation.Communication.Update'), controller.update);
    router.delete('/:id', auth('Assorted.BloodDonation.Communication.Delete'), controller.delete);

    app.use('/api/v1/clinical/donation-communication', router);
};
