import express from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { Loader } from '../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new OrganizationController();

    router.post('/', authenticator.authenticateClient, controller.create);

    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);

    router.get('/by-contact-user/:contactUserId', authenticator.authenticateClient,
        authenticator.authenticateUser, controller.getByContactUserId);

    router.get('/by-person/:personId', authenticator.authenticateClient,
        authenticator.authenticateUser, controller.getByPersonId);

    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);

    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);

    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    router.post('/:id/add-address/:addressId', authenticator.authenticateClient, authenticator.authenticateUser, controller.addAddress);

    router.post('/:id/remove-address/:addressId', authenticator.authenticateClient, authenticator.authenticateUser, controller.removeAddress);

    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/organizations', router);
};
