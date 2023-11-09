import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { HealthSystemService } from '../../../services/hospitals/health.system.service';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { Loader } from '../../../startup/loader';
import { HealthSystemValidator } from './health.system.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthSystemController extends BaseController {

    //#region member variables and constructors

    _service: HealthSystemService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _organizationService: OrganizationService = null;

    _validator = new HealthSystemValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(HealthSystemService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._organizationService = Loader.container.resolve(OrganizationService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthSystem.Create', request, response);

            const domainModel = await this._validator.create(request);
            const hospitalSystem = await this._service.create(domainModel);
            if (hospitalSystem == null) {
                throw new ApiError(400, 'Cannot create hospitalSystem!');
            }

            ResponseHandler.success(request, response, 'HealthSystem created successfully!', 201, {
                HealthSystem : hospitalSystem,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthSystem.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const hospitalSystem = await this._service.getById(id);
            if (hospitalSystem == null) {
                throw new ApiError(404, 'HealthSystem not found.');
            }

            ResponseHandler.success(request, response, 'HealthSystem retrieved successfully!', 200, {
                HealthSystem : hospitalSystem,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthSystem.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} hospitalSystem records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { HealthSystems: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthSystem.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingHealthSystem = await this._service.getById(id);
            if (existingHealthSystem == null) {
                throw new ApiError(404, 'HealthSystem not found.');
            }
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update hospitalSystem record!');
            }

            ResponseHandler.success(request, response, 'HealthSystem record updated successfully!', 200, {
                HealthSystem : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthSystem.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingHealthSystem = await this._service.getById(id);
            if (existingHealthSystem == null) {
                throw new ApiError(404, 'HealthSystem not found.');
            }
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'HealthSystem cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'HealthSystem record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getHealthSystemsWithTags = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthSystem.GetHealthSystemsWithTags', request, response);

            const tags = request.query.tags as string;
            const hospitalSystems = await this._service.getHealthSystemsWithTags(tags);

            ResponseHandler.success(request, response, 'HealthSystem records retrieved successfully!', 200, {
                HealthSystems : hospitalSystems,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
