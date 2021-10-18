import express from 'express';
import { ApiError } from '../../common/api.error';
import { ResponseHandler } from '../../common/response.handler';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { AddressService } from '../../services/address.service';
import { OrganizationService } from '../../services/organization.service';
import { PersonService } from '../../services/person.service';
import { RoleService } from '../../services/role.service';
import { Loader } from '../../startup/loader';
import { AddressValidator } from '../validators/address.validator';
import { BaseController } from './base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class AddressController extends BaseController {

    //#region member variables and constructors

    _service: AddressService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _organizationService: OrganizationService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(AddressService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._organizationService = Loader.container.resolve(OrganizationService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Address.Create', request, response);
            
            const domainModel = await AddressValidator.create(request);
            const address = await this._service.create(domainModel);
            if (address == null) {
                throw new ApiError(400, 'Cannot create address!');
            }

            ResponseHandler.success(request, response, 'Address created successfully!', 201, {
                Address : address,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Address.GetById', request, response);

            const id: uuid = await AddressValidator.getById(request);
            const address = await this._service.getById(id);
            if (address == null) {
                throw new ApiError(404, 'Address not found.');
            }

            ResponseHandler.success(request, response, 'Address retrieved successfully!', 200, {
                Address : address,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Address.Search', request, response);

            const filters = await AddressValidator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} address records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { Addresses: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Address.Update', request, response);

            const domainModel = await AddressValidator.update(request);
            const id: uuid = await AddressValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Address not found.');
            }
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update address record!');
            }

            ResponseHandler.success(request, response, 'Address record updated successfully!', 200, {
                Address : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Address.Delete', request, response);

            const id: uuid = await AddressValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Address not found.');
            }
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Address cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Address record deleted successfully!', 200, {
                Deleted : true,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
