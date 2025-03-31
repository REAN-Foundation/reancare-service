import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { DeliveryService } from '../../../../services/clinical/maternity/delivery.service';
import { Injector } from '../../../../startup/injector';
import { DeliveryValidator } from './delivery.validator';
import { BaseController } from '../../../base.controller';
import { PostnatalVisitService } from '../../../../services/clinical/maternity/postnatal.visit.service';
import { PostnatalMedicationService } from '../../../../services/clinical/maternity/postnatal.medication.service';

///////////////////////////////////////////////////////////////////////////////////////

export class DeliveryController extends BaseController {

    //#region member variables and constructors

    _service: DeliveryService = Injector.Container.resolve(DeliveryService);

    _postnatalVisitService: PostnatalVisitService = Injector.Container.resolve(PostnatalVisitService);

    _postnatalMedicationService: PostnatalMedicationService = Injector.Container.resolve(PostnatalMedicationService);
    
    _validator: DeliveryValidator = new DeliveryValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);
            const delivery = await this._service.create(model);
            if (delivery == null) {
                throw new ApiError(400, 'Cannot create record for delivery!');
            }

            ResponseHandler.success(request, response, 'Delivery record created successfully!', 201, {
                Delivery: delivery,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const delivery = await this._service.getById(id);
            if (delivery == null) {
                throw new ApiError(404, 'Delivery record not found.');
            }

            ResponseHandler.success(request, response, 'Delivery record retrieved successfully!', 200, {
                Delivery: delivery,
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
                    ? 'No delivery records found!'
                    : `Total ${count} delivery records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Deliveries: searchResults
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Delivery record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update delivery record!');
            }

            ResponseHandler.success(request, response, 'Delivery record updated successfully!', 200, {
                Delivery: updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Delivery record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Delivery record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Delivery record deleted successfully!', 200, {
                Deleted: true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

     //#region Postnatal visit

     createPostnatalVisit = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.createPostnatalVisit(request);
            const postnatalVisit = await this._postnatalVisitService.create(model);
            if (postnatalVisit == null) {
                throw new ApiError(400, 'Cannot create record for postnatal visit!');
            }

            ResponseHandler.success(request, response, 'Postnatal visit record created successfully!', 201, {
                PostnatalVisit: postnatalVisit,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPostnatalVisitById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const postnatalVisitId: uuid = await this._validator.getParamUuid(request, 'postnatalVisitId');
            const postnatalVisit = await this._postnatalVisitService.getById(postnatalVisitId);
            if (postnatalVisit == null) {
                throw new ApiError(404, 'Postnatal visit record not found.');
            }

            ResponseHandler.success(request, response, 'Postnatal visit record retrieved successfully!', 200, {
                PostnatalVisit: postnatalVisit,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    searchPostnatalVisit = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchPostnatalVisit(request);
            const searchResults = await this._postnatalVisitService.search(filters);
            const count = searchResults.Items.length;
            const message = count === 0 ? 'No postnatal visit records found!' : `Total ${count} postnatal visit records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                PostnatalVisits: searchResults,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updatePostnatalVisit = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.updatePostnatalVisit(request);
            const postnatalVisitId: uuid = await this._validator.getParamUuid(request, 'postnatalVisitId');
            const existingRecord = await this._postnatalVisitService.getById(postnatalVisitId);
            if (existingRecord == null) {
                throw new ApiError(404, 'Postnatal visit record not found.');
            }

            const updated = await this._postnatalVisitService.update(postnatalVisitId, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update postnatal visit record!');
            }

            ResponseHandler.success(request, response, 'Postnatal visit record updated successfully!', 200, {
                PostnatalVisit: updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deletePostnatalVisit = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const postnatalVisitId: uuid = await this._validator.getParamUuid(request, 'postnatalVisitId');
            const existingRecord = await this._postnatalVisitService.getById(postnatalVisitId);
            if (existingRecord == null) {
                throw new ApiError(404, 'Postnatal visit record not found.');
            }

            const deleted = await this._postnatalVisitService.delete(postnatalVisitId);
            if (!deleted) {
                throw new ApiError(400, 'Postnatal visit record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Postnatal visit record deleted successfully!', 200, {
                Deleted: true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Postnatal medication

    createPostnatalMedication = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.createPostnatalMedication(request);
            const postnatalMedication = await this._postnatalMedicationService.create(model);
            if (postnatalMedication == null) {
                throw new ApiError(400, 'Cannot create record for postnatal medication!');
            }

            ResponseHandler.success(request, response, 'Postnatal medication record created successfully!', 201, {
                PostnatalMedication: postnatalMedication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPostnatalMedicationById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const postnatalMedicationId: uuid = await this._validator.getParamUuid(request, 'postnatalMedicationId');
            const postnatalMedication = await this._postnatalMedicationService.getById(postnatalMedicationId);
            if (postnatalMedication == null) {
                throw new ApiError(404, 'Postnatal medication record not found.');
            }

            ResponseHandler.success(request, response, 'Postnatal medication record retrieved successfully!', 200, {
                PostnatalMedication: postnatalMedication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updatePostnatalMedication = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.updatePostnatalMedication(request);
            const postnatalMedicationId: uuid = await this._validator.getParamUuid(request, 'postnatalMedicationId');
            const existingRecord = await this._postnatalMedicationService.getById(postnatalMedicationId);
            if (existingRecord == null) {
                throw new ApiError(404, 'Postnatal medication record not found.');
            }

            const updated = await this._postnatalMedicationService.update(postnatalMedicationId, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update postnatal medication record!');
            }

            ResponseHandler.success(request, response, 'Postnatal medication record updated successfully!', 200, {
                PostnatalMedication: updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deletePostnatalMedication = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const postnatalMedicationId: uuid = await this._validator.getParamUuid(request, 'postnatalMedicationId');
            const existingRecord = await this._postnatalMedicationService.getById(postnatalMedicationId);
            if (existingRecord == null) {
                throw new ApiError(404, 'Postnatal medication record not found.');
            }

            const deleted = await this._postnatalMedicationService.delete(postnatalMedicationId);
            if (!deleted) {
                throw new ApiError(400, 'Postnatal medication record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Postnatal medication record deleted successfully!', 200, {
                Deleted: true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
