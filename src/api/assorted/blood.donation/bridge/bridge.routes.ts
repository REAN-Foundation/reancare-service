import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BridgeController } from './bridge.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BridgeController();

    router.post('/', auth('Assorted.BloodDonation.Bridge.Create'), controller.create);
    router.get('/search', auth('Assorted.BloodDonation.Bridge.Search'), controller.search);
    router.get('/:id', auth('Assorted.BloodDonation.Bridge.GetById'), controller.getById);
    router.put('/:id', auth('Assorted.BloodDonation.Bridge.Update'), controller.update);
    router.delete('/:id', auth('Assorted.BloodDonation.Bridge.Delete'), controller.delete);

    app.use('/api/v1/clinical/patient-donors', router);
};
