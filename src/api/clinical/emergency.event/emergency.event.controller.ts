import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { EmergencyEventService } from '../../../services/clinical/emergency.event.service';
import { OrganizationService } from '../../../services/general/organization.service';
import { PatientService } from '../../../services/users/patient/patient.service';
import { RoleService } from '../../../services/role/role.service';
import { Loader } from '../../../startup/loader';
import { EmergencyEventValidator } from './emergency.event.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyEventController {

    //#region member variables and constructors

    _service: EmergencyEventService = null;

    _roleService: RoleService = null;

    _patientService: PatientService = null;

    _organizationService: OrganizationService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(EmergencyEventService);
        this._roleService = Loader.container.resolve(RoleService);
        this._patientService = Loader.container.resolve(PatientService);
        this._organizationService = Loader.container.resolve(OrganizationService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'EmergencyEvent.Create';
            await this._authorizer.authorize(request, response);

            const domainModel = await EmergencyEventValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._patientService.getByUserId(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const emergencyEvent = await this._service.create(domainModel);
            if (emergencyEvent == null) {
                throw new ApiError(400, 'Cannot create emergency event!');
            }

            ResponseHandler.success(request, response, 'Emergency Event created successfully!', 201, {
                EmergencyEvent : emergencyEvent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'EmergencyEvent.GetById';

            await this._authorizer.authorize(request, response);

            const id: string = await EmergencyEventValidator.getById(request);

            const emergencyEvent = await this._service.getById(id);
            if (emergencyEvent == null) {
                throw new ApiError(404, 'Emergency Event not found.');
            }

            ResponseHandler.success(request, response, 'Emergency Event retrieved successfully!', 200, {
                EmergencyEvent : emergencyEvent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'EmergencyEvent.Search';
            await this._authorizer.authorize(request, response);

            const filters = await EmergencyEventValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} emergency event records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { EmergencyEvents: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'EmergencyEvent.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await EmergencyEventValidator.update(request);

            const id: string = await EmergencyEventValidator.getById(request);
            const existingEmergencyEvent = await this._service.getById(id);
            if (existingEmergencyEvent == null) {
                throw new ApiError(404, 'Emergency Event not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update emergency event record!');
            }

            ResponseHandler.success(request, response, 'Emergency Event record updated successfully!', 200, {
                EmergencyEvent : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'EmergencyEvent.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await EmergencyEventValidator.getById(request);
            const existingEmergencyEvent = await this._service.getById(id);
            if (existingEmergencyEvent == null) {
                throw new ApiError(404, 'Emergency Event not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Emergency Event cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Emergency Event record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
