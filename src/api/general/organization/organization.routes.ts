import express from 'express';
import { OrganizationController } from './organization.controller';
import { auth } from '../../../auth/auth.handler';
import { OrganizationAuth } from './organization.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new OrganizationController();

    router.post('/', auth(OrganizationAuth.create), controller.create);
    router.get('/search', auth(OrganizationAuth.search), controller.search);

    router.get('/by-contact-user/:contactUserId', auth(OrganizationAuth.getByContactUserId), controller.getByContactUserId);
    router.get('/:id/addresses', auth(OrganizationAuth.getAddresses), controller.getAddresses);
    router.get('/:id/persons', auth(OrganizationAuth.getPersons), controller.getPersons);
    router.get('/:id', auth(OrganizationAuth.getById), controller.getById);

    router.put('/:id', auth(OrganizationAuth.update), controller.update);
    router.delete('/:id', auth(OrganizationAuth.delete), controller.delete);

    //Addresses
    router.post('/:id/add-address/:addressId', auth(OrganizationAuth.addAddress), controller.addAddress);
    router.post('/:id/remove-address/:addressId', auth(OrganizationAuth.removeAddress), controller.removeAddress);

    //Persons
    router.post('/:id/add-person/:personId', auth(OrganizationAuth.addPerson), controller.addPerson);
    router.post('/:id/remove-person/:personId', auth(OrganizationAuth.removePerson), controller.removePerson);

    app.use('/api/v1/organizations', router);
};
