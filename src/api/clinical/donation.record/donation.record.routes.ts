import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { DonationRecordController } from './donation.record.controller';
///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DonationRecordController();

    router.post('/', auth('DonationRecord.Create'), controller.create);
    router.get('/search', auth('DonationRecord.Search'), controller.search);
    router.get('/:id', auth('DonationRecord.GetById'), controller.getById);
    router.put('/:id', auth('DonationRecord.Update'), controller.update);
    router.delete('/:id', auth('DonationRecord.Delete'), controller.delete);

    app.use('/api/v1/clinical/donation-record', router);
};
