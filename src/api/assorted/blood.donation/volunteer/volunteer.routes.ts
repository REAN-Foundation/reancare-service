import express from 'express';
import { VolunteerController } from './volunteer.controller';
import { auth } from '../../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new VolunteerController();

    router.post('/', auth('Assorted.BloodDonation.Volunteer.Create', true), controller.create);
    router.get('/search', auth('Assorted.BloodDonation.Volunteer.Search'), controller.search);
    router.get('/:userId', auth('Assorted.BloodDonation.Volunteer.GetByUserId'), controller.getByUserId);
    router.put('/:userId', auth('Assorted.BloodDonation.Volunteer.UpdateByUserId'), controller.updateByUserId);
    router.delete('/:userId', auth('Assorted.BloodDonation.Volunteer.DeleteByUserId'), controller.delete);

    app.use('/api/v1/volunteers', router);
};
