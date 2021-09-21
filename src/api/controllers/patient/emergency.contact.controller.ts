import express from 'express';

import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { Authorizer } from '../../../auth/authorizer';
import { PersonService } from '../../../services/person.service';

import { ApiError } from '../../../common/api.error';
import { EmergencyContactValidator } from '../../validators/patient/emergency.contact.validator';
import { EmergencyContactService } from '../../../services/patient/emergency.contact.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { OrganizationService } from '../../../services/organization.service';
import { AddressService } from '../../../services/address.service';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyContactController {

    //#region member variables and constructors

    _service: EmergencyContactService = null;

    _roleService: RoleService = null;

    _orgService: OrganizationService = null;

    _personService: PersonService = null;

    _userService: UserService = null;

    _authorizer: Authorizer = null;

    _addressService: AddressService = null

    constructor() {
        this._service = Loader.container.resolve(EmergencyContactService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._orgService = Loader.container.resolve(OrganizationService);
        this._userService = Loader.container.resolve(UserService);
        this._addressService = Loader.container.resolve(AddressService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Emergency.Contact.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await EmergencyContactValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            if (domainModel.ContactPersonId != null) {
                const person = await this._userService.getById(domainModel.ContactPersonId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.ContactPersonId} cannot be found.`);
                }
            }

            if (domainModel.AddressId != null) {
                const person = await this._addressService.getById(domainModel.AddressId);
                if (person == null) {
                    throw new ApiError(404, `Address with an id ${domainModel.AddressId} cannot be found.`);
                }
            }

            if (domainModel.OrganizationId != null) {
                const person = await this._orgService.getById(domainModel.OrganizationId);
                if (person == null) {
                    throw new ApiError(404, `Organization with an id ${domainModel.OrganizationId} cannot be found.`);
                }
            }

            const patientEmergencyContact = await this._service.create(domainModel);
            if (patientEmergencyContact == null) {
                throw new ApiError(400, 'Cannot create patientEmergencyContact!');
            }

            ResponseHandler.success(request, response, 'EmergencyContact created successfully!', 201, {
                EmergencyContact : patientEmergencyContact,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Emergency.Contact.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await EmergencyContactValidator.getById(request);

            const patientEmergencyContact = await this._service.getById(id);
            if (patientEmergencyContact == null) {
                throw new ApiError(404, 'EmergencyContact not found.');
            }

            ResponseHandler.success(request, response, 'EmergencyContact retrieved successfully!', 200, {
                EmergencyContact : patientEmergencyContact,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Emergency.Contact.Search';
            await this._authorizer.authorize(request, response);

            const filters = await EmergencyContactValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} patientEmergencyContact records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { EmergencyContacts: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Emergency.Contact.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await EmergencyContactValidator.update(request);

            const id: string = await EmergencyContactValidator.getById(request);
            const existingEmergencyContact = await this._service.getById(id);
            if (existingEmergencyContact == null) {
                throw new ApiError(404, 'EmergencyContact not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update patientEmergencyContact record!');
            }

            ResponseHandler.success(request, response, 'EmergencyContact record updated successfully!', 200, {
                EmergencyContact : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Emergency.Contact.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await EmergencyContactValidator.getById(request);
            const existingEmergencyContact = await this._service.getById(id);
            if (existingEmergencyContact == null) {
                throw new ApiError(404, 'EmergencyContact not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'EmergencyContact cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'EmergencyContact record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
