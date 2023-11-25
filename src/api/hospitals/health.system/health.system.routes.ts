import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { HealthSystemController } from './health.system.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthSystemController();

    router.post('/', auth('HealthSystem.Create'), controller.create);
    router.get('/by-tags', auth('HealthSystem.GetHealthSystemsWithTags'), controller.getHealthSystemsWithTags);
    router.get('/search', auth('HealthSystem.Search'), controller.search);
    router.get('/:id', auth('HealthSystem.GetById'), controller.getById);
    router.put('/:id', auth('HealthSystem.Update'), controller.update);
    router.delete('/:id', auth('HealthSystem.Delete'), controller.delete);

    app.use('/api/v1/health-systems', router);
};
