import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { HealthSystemService } from '../../../services/hospitals/health.system.service';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { HealthSystemValidator } from './health.system.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthSystemController extends BaseController {

    //#region member variables and constructors

    _service: HealthSystemService = Injector.Container.resolve(HealthSystemService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _organizationService: OrganizationService = Injector.Container.resolve(OrganizationService);

    _validator = new HealthSystemValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.create(request);
            await this.authorizeOne(request, null, domainModel.TenantId);
            const hospitalSystem = await this._service.create(domainModel);
            if (hospitalSystem == null) {
                throw new ApiError(400, 'Cannot create Hospital System!');
            }

            ResponseHandler.success(request, response, 'Health system created successfully!', 201, {
                HealthSystem : hospitalSystem,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const hospitalSystem = await this._service.getById(id);
            if (hospitalSystem == null) {
                throw new ApiError(404, 'Health system not found.');
            }

            ResponseHandler.success(request, response, 'Health system retrieved successfully!', 200, {
                HealthSystem : hospitalSystem,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Hospital system records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { HealthSystems: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingHealthSystem = await this._service.getById(id);
            if (existingHealthSystem == null) {
                throw new ApiError(404, 'Health system not found.');
            }
            await this.authorizeOne(request, null, existingHealthSystem.TenantId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update hospital system record!');
            }

            ResponseHandler.success(request, response, 'Health system record updated successfully!', 200, {
                HealthSystem : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorizeOne(request, null, null);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingHealthSystem = await this._service.getById(id);
            if (existingHealthSystem == null) {
                throw new ApiError(404, 'Health system not found.');
            }
            await this.authorizeOne(request, null, existingHealthSystem.TenantId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Health system cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Health system record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getHealthSystemsWithTags = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tags = request.query.tags as string;
            const hospitalSystems = await this._service.getHealthSystemsWithTags(tags);

            ResponseHandler.success(request, response, 'Health system records retrieved successfully!', 200, {
                HealthSystems : hospitalSystems,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
