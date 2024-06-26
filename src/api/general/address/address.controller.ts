import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { AddressService } from '../../../services/general/address.service';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { AddressValidator } from './address.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import { AddressSearchFilters } from '../../../domain.types/general/address/address.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AddressController extends BaseController {

    //#region member variables and constructors

    _service: AddressService = Injector.Container.resolve(AddressService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _organizationService: OrganizationService = Injector.Container.resolve(OrganizationService);

    _validator = new AddressValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeOne(request);
            const address = await this._service.create(model);
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
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const address = await this._service.getById(id);
            if (address == null) {
                throw new ApiError(404, 'Address not found.');
            }
            await this.authorizeOne(request);
            ResponseHandler.success(request, response, 'Address retrieved successfully!', 200, {
                Address : address,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
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
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Address not found.');
            }
            await this.authorizeOne(request);
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Address not found.');
            }
            await this.authorizeOne(request);
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

    authorizeSearch = async (
        request: express.Request,
        searchFilters: AddressSearchFilters): Promise<AddressSearchFilters> => {

        if (searchFilters.TenantId != null) {
            if (searchFilters.TenantId !== request.currentUser.TenantId) {
                throw new ApiError(403, 'Forbidden');
            }
        }
        else {
            searchFilters.TenantId = request.currentUser.TenantId;
        }
        return searchFilters;
    };

}
