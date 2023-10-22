import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CustomQueryController } from './custom.query.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CustomQueryController();

    router.post('/', auth('Statistics.CustomQuery.ExecuteQuery'), controller.executeQuery);
    router.get('/search', auth('Statistics.CustomQuery.Search'), controller.search);
    router.get('/:id', auth('Statistics.CustomQuery.GetById'), controller.getById);
    router.put('/:id', auth('Statistics.CustomQuery.Update'), controller.update);
    router.delete('/:id', auth('Statistics.CustomQuery.Delete'), controller.delete);

    app.use('/api/v1/custom-query', router);
};
