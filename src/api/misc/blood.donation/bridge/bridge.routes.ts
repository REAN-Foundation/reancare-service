import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BridgeController } from './bridge.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BridgeController();

    router.post('/', auth('PatientDonors.Create'), controller.create);
    router.get('/search', auth('PatientDonors.Search'), controller.search);
    router.get('/:id', auth('PatientDonors.GetById'), controller.getById);
    router.put('/:id', auth('PatientDonors.Update'), controller.update);
    router.delete('/:id', auth('PatientDonors.Delete'), controller.delete);

    app.use('/api/v1/clinical/patient-donors', router);
};
