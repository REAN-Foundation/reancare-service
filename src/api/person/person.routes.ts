import express from 'express';
import { PersonController } from './person.controller';
import { auth } from '../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PersonController();

    //Note:
    //For person controller, there will not be end-points for create, update and delete.
    //Person will not be directly created/updated/deleted, but through user/person type specific
    //entity controllers such patient, doctor, etc.

    router.get('/phone/:phone/role/:roleId', auth('Person.GetAllPersonsWithPhoneAndRole'), controller.getAllPersonsWithPhoneAndRole);
    router.get('/phone/:phone', auth('Person.GetAllPersonsWithPhone'), controller.getAllPersonsWithPhone);
    //Person may be associated with multiple organizations.
    //e.g. A apecialist doctor may be associated multiple hospitals
    router.get('/:id/organizations', auth('Person.GetOrganizations'), controller.getOrganizations);

    //Person can have multiple addresses. Also multiple persons can share same address. e.g. Family members
    router.post('/:id/add-address/:addressId', auth('Person.AddAddress'), controller.addAddress);
    router.post('/:id/remove-address/:addressId', auth('Person.RemoveAddress'), controller.removeAddress);
    router.get('/:id/addresses', auth('Person.GetAddresses'), controller.getAddresses);

    //Get person details including multiple user-roles that person may have
    router.get('/:id', auth('Person.GetById'), controller.getById);

    app.use('/api/v1/persons', router);
};
