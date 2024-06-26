import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { HospitalService } from '../../../services/hospitals/hospital.service';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { HospitalValidator } from './hospital.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class HospitalController extends BaseController{

    //#region member variables and constructors

    _service: HospitalService = Injector.Container.resolve(HospitalService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _organizationService: OrganizationService = Injector.Container.resolve(OrganizationService);

    _validator = new HospitalValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.create(request);
            const hospital = await this._service.create(domainModel);
            if (hospital == null) {
                throw new ApiError(400, 'Cannot create hospital!');
            }

            ResponseHandler.success(request, response, 'Hospital created successfully!', 201, {
                Hospital : hospital,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const hospital = await this._service.getById(id);
            if (hospital == null) {
                throw new ApiError(404, 'Hospital not found.');
            }

            ResponseHandler.success(request, response, 'Hospital retrieved successfully!', 200, {
                Hospital : hospital,
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
                    : `Total ${count} hospital records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { Hospitals: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingHospital = await this._service.getById(id);
            if (existingHospital == null) {
                throw new ApiError(404, 'Hospital not found.');
            }
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update hospital record!');
            }

            ResponseHandler.success(request, response, 'Hospital record updated successfully!', 200, {
                Hospital : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingHospital = await this._service.getById(id);
            if (existingHospital == null) {
                throw new ApiError(404, 'Hospital not found.');
            }
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Hospital cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Hospital record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getHospitalsForHealthSystem = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const healthSystemId: uuid = await this._validator.getParamUuid(request, 'healthSystemId');
            const hospitals = await this._service.getHospitalsForHealthSystem(healthSystemId);

            ResponseHandler.success(request, response, 'Hospitals retrieved successfully!', 200, {
                Hospitals : hospitals,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
