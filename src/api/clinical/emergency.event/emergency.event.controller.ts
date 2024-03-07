import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { EmergencyEventService } from '../../../services/clinical/emergency.event.service';
import { OrganizationService } from '../../../services/general/organization.service';
import { PatientService } from '../../../services/users/patient/patient.service';
import { RoleService } from '../../../services/role/role.service';
import { EmergencyEventValidator } from './emergency.event.validator';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyEventController {

    //#region member variables and constructors

    _service: EmergencyEventService = Injector.Container.resolve(EmergencyEventService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _organizationService: OrganizationService = Injector.Container.resolve(OrganizationService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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
