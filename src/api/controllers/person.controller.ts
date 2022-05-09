import express from 'express';
import { ApiError } from '../../common/api.error';
import { ResponseHandler } from '../../common/response.handler';
import { PersonService } from '../../services/person.service';
import { Loader } from '../../startup/loader';
import { PersonValidator } from '../validators/person.validator';
import { BaseController } from './base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class PersonController extends BaseController {

    //#region member variables and constructors

    _service: PersonService = null;

    _validator: PersonValidator = new PersonValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(PersonService);

    }

    //#endregion

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Person.GetById', request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            const person = await this._service.getById(id);
            if (person == null) {
                ResponseHandler.failure(request, response, 'Person not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'Person retrieved successfully!', 200, {
                Person : person,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
            
        }
    };

    getAllPersonsWithPhoneAndRole = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Person.GetAllPersonsWithPhoneAndRole', request, response);

            const { phone, roleId } = await this._validator.getAllPersonsWithPhoneAndRole(request);
            const persons = await this._service.getAllPersonsWithPhoneAndRole(phone, roleId);
            const message =
                persons.length === 0 ?
                    'No records found!' : `Total ${persons.length} person records retrieved successfully!`;
                
            ResponseHandler.success(request, response, message, 200, {
                Persons : persons,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getOrganizations = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Person.GetOrganizations', request, response);
            const id: string = await this._validator.getParamUuid(request, 'id');
            const organizations = await this._service.getOrganizations(id);

            const message = organizations.length === 0 ?
                'No records found!' : `Total ${organizations.length} organization records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Organizations : organizations,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    addAddress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Person.AddAddress', request, response);
            const { id, addressId } = await this._validator.addOrRemoveAddress(request);
            const person = await this._service.getById(id);
            if (person == null) {
                throw new ApiError(404, 'Person not found.');
            }

            const added = await this._service.addAddress(id, addressId);
            if (!added) {
                throw new ApiError(400, 'Organization address cannot be added.');
            }

            ResponseHandler.success(request, response, 'Person address record added successfully!', 200, {
                Added : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeAddress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Person.RemoveAddress', request, response);
            
            const { id, addressId } = await this._validator.addOrRemoveAddress(request);
            const person = await this._service.getById(id);
            if (person == null) {
                throw new ApiError(404, 'Person not found.');
            }

            const removed = await this._service.removeAddress(id, addressId);
            if (!removed) {
                throw new ApiError(400, 'Person address cannot be removed.');
            }

            ResponseHandler.success(request, response, 'Organization address record removed successfully!', 200, {
                Removed : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAddresses = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Person.GetAddresses', request, response);
            const id: string = await this._validator.getParamUuid(request, 'id');
            const addresses = await this._service.getAddresses(id);
                        
            const message = addresses.length === 0 ?
                'No records found!' : `Total ${addresses.length} address records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Addresses : addresses,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
}
