import express from 'express';
import { DonorController } from './donor.controller';
import { auth } from '../../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DonorController();

    router.post('/', auth('Assorted.BloodDonation.Donor.Create', true), controller.create);
    router.get('/search', auth('Assorted.BloodDonation.Donor.Search'), controller.search);
    router.get('/:userId', auth('Assorted.BloodDonation.Donor.GetByUserId'), controller.getByUserId);
    router.put('/:userId', auth('Assorted.BloodDonation.Donor.UpdateByUserId'), controller.updateByUserId);
    router.delete('/:userId', auth('Assorted.BloodDonation.Donor.DeleteByUserId'), controller.delete);

    app.use('/api/v1/donors', router);
};
