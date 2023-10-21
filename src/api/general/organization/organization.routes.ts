import express from 'express';
import { OrganizationController } from './organization.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new OrganizationController();

    router.post('/', auth('Organization.Create'), controller.create);

    router.get('/search', auth('Organization.Search'), controller.search);

    router.get('/by-contact-user/:contactUserId', auth('Organization.GetByContactUserId'), controller.getByContactUserId);
    router.get('/:id/addresses', auth('Organization.GetAddresses'), controller.getAddresses);
    router.get('/:id/persons', auth('Organization.GetPersons'), controller.getPersons);
    router.get('/:id', auth('Organization.GetById'), controller.getById);

    router.put('/:id', auth('Organization.Update'), controller.update);
    router.delete('/:id', auth('Organization.Delete'), controller.delete);

    //Addresses
    router.post('/:id/add-address/:addressId', auth('Organization.AddAddress'), controller.addAddress);
    router.post('/:id/remove-address/:addressId', auth('Organization.RemoveAddress'), controller.removeAddress);

    //Persons
    router.post('/:id/add-person/:personId', auth('Organization.AddPerson'), controller.addPerson);
    router.post('/:id/remove-person/:personId', auth('Organization.RemovePerson'), controller.removePerson);

    app.use('/api/v1/organizations', router);
};
