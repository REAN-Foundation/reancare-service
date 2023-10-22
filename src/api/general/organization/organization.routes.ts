import express from 'express';
import { OrganizationController } from './organization.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new OrganizationController();

    router.post('/', auth('General.Organization.Create'), controller.create);
    router.get('/search', auth('General.Organization.Search'), controller.search);

    router.get('/by-contact-user/:contactUserId', auth('General.Organization.GetByContactUserId'), controller.getByContactUserId);
    router.get('/:id/addresses', auth('General.Organization.GetAddresses'), controller.getAddresses);
    router.get('/:id/persons', auth('General.Organization.GetPersons'), controller.getPersons);
    router.get('/:id', auth('General.Organization.GetById'), controller.getById);

    router.put('/:id', auth('General.Organization.Update'), controller.update);
    router.delete('/:id', auth('General.Organization.Delete'), controller.delete);

    //Addresses
    router.post('/:id/add-address/:addressId', auth('General.Organization.AddAddress'), controller.addAddress);
    router.post('/:id/remove-address/:addressId', auth('General.Organization.RemoveAddress'), controller.removeAddress);

    //Persons
    router.post('/:id/add-person/:personId', auth('General.Organization.AddPerson'), controller.addPerson);
    router.post('/:id/remove-person/:personId', auth('General.Organization.RemovePerson'), controller.removePerson);

    app.use('/api/v1/organizations', router);
};
