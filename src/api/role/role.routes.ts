import express from 'express';
import { RoleController } from './role.controller';
import { auth } from '../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new RoleController();

    router.post('/', auth('Role.Create'), controller.create);
    router.get('/search', auth('Role.Search'), controller.search);
    router.put('/:id', auth('Role.Update'), controller.update);
    router.delete('/:id', auth('Role.Delete'), controller.delete);
    router.get('/:id', auth('Role.GetById'), controller.getById);

    app.use('/api/v1/roles', router);
};

