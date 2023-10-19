import express from 'express';
import { OrganizationController } from './organization.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new OrganizationController();

    router.post('/', controller.create);

    router.get('/search', auth(), controller.search);

    router.get('/by-contact-user/:contactUserId', auth(), controller.getByContactUserId);
    router.get('/:id/addresses', auth(), controller.getAddresses);
    router.get('/:id/persons', auth(), controller.getPersons);
    router.get('/:id', auth(), controller.getById);

    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    //Addresses
    router.post('/:id/add-address/:addressId', auth(), controller.addAddress);
    router.post('/:id/remove-address/:addressId', auth(), controller.removeAddress);

    //Persons
    router.post('/:id/add-person/:personId', auth(), controller.addPerson);
    router.post('/:id/remove-person/:personId', auth(), controller.removePerson);

    app.use('/api/v1/organizations', router);
};
