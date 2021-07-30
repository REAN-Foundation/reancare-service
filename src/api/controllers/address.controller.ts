import express from 'express';

import { Helper } from '../../common/helper';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { PersonService } from '../../services/person.service';
//import { OrganizationService } from '../../services/organization.service';
import { ApiError } from '../../common/api.error';
import { AddressValidator } from '../validators/address.validator';
import { AddressService } from '../../services/address.service';
import { RoleService } from '../../services/role.service';

///////////////////////////////////////////////////////////////////////////////////////

export class AddressController {
    //#region member variables and constructors

    _service: AddressService = null;
    _roleService: RoleService = null;
    _personService: PersonService = null;
    //_organizationService: OrganizationService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(AddressService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        //this._organizationService = Loader.container.resolve(OrganizationService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Address.Create';

            var domainModel = await AddressValidator.create(request, response);

            if (domainModel.PersonId != null) {
                var person = await this._personService.getById(domainModel.PersonId);
                if (person != null) {
                    throw new ApiError(404, `Person with an id ${domainModel.PersonId} cannot be found.`);
                }
            }

            // if(domainModel.OrganizationId != null) {
            //     var organization = await this._organizationService.getById(domainModel.OrganizationId);
            //     if(organization != null) {
            //         throw new ApiError(404, `Organization with an id ${domainModel.OrganizationId} cannot be found.`)
            //     }
            // }

            var address = await this._service.create(domainModel);
            if (address == null) {
                throw new ApiError(400, 'Cannot create address!');
            }

            ResponseHandler.success(request, response, 'Address created successfully!', 201, {
                Address: address,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Address.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            var id: string = await AddressValidator.getById(request, response);

            const address = await this._service.getById(id);
            if (address == null) {
                throw new ApiError(404, 'Address not found.');
            }

            ResponseHandler.success(request, response, 'Address retrieved successfully!', 200, {
                Address: address,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Address.Search';
            await this._authorizer.authorize(request, response);

            var filters = await AddressValidator.search(request, response);

            const addresses = await this._service.search(filters);
            if (addresses != null) {
                var count = addresses.length;
                var message =
                    count == 0
                        ? 'No records found!'
                        : `Total ${count} address records retrieved successfully!`;
                ResponseHandler.success(request, response, message, 200, { Addresses: addresses });
                return;
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Address.Update';
            await this._authorizer.authorize(request, response);

            var domainModel = await AddressValidator.update(request, response);

            var id: string = await AddressValidator.getById(request, response);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Address not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update address record!');
            }

            ResponseHandler.success(request, response, 'Address record updated successfully!', 201, {
                Address: updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Address.Delete';
            await this._authorizer.authorize(request, response);

            var id: string = await AddressValidator.getById(request, response);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Address not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Address cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Address record deleted successfully!', 200, {
                Deleted: true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
}
