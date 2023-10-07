import express from 'express';
import { OrganizationController } from './organization.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new OrganizationController();

    router.post('/', controller.create);

    router.get('/search', authenticator.authenticateUser, controller.search);

    router.get('/by-contact-user/:contactUserId', authenticator.authenticateUser, controller.getByContactUserId);
    router.get('/:id/addresses', authenticator.authenticateUser, controller.getAddresses);
    router.get('/:id/persons', authenticator.authenticateUser, controller.getPersons);
    router.get('/:id', authenticator.authenticateUser, controller.getById);

    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    //Addresses
    router.post('/:id/add-address/:addressId', authenticator.authenticateUser, controller.addAddress);
    router.post('/:id/remove-address/:addressId', authenticator.authenticateUser, controller.removeAddress);

    //Persons
    router.post('/:id/add-person/:personId', authenticator.authenticateUser, controller.addPerson);
    router.post('/:id/remove-person/:personId', authenticator.authenticateUser, controller.removePerson);

    app.use('/api/v1/organizations', router);
};
