import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CustomQueryController } from './custom.query.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CustomQueryController();

    router.post('/', auth('CustomQuery.ExecuteQuery'), controller.executeQuery);
    router.get('/search', auth('CustomQuery.Search'), controller.search);
    router.get('/:id', auth('CustomQuery.GetById'), controller.getById);
    router.put('/:id', auth('CustomQuery.Update'), controller.update);
    router.delete('/:id', auth('CustomQuery.Delete'), controller.delete);

    app.use('/api/v1/custom-query', router);
};
