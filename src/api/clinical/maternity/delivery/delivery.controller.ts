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
import { ComplicationService } from '../../../../services/clinical/maternity/complication.service';
import { BabyService } from '../../../../services/clinical/maternity/baby.service';
import { BreastfeedingService } from '../../../../services/clinical/maternity/breastfeeding.service';
import { PregnancyService } from '../../../../services/clinical/maternity/pregnancy.service';


///////////////////////////////////////////////////////////////////////////////////////

export class DeliveryController extends BaseController {

    //#region member variables and constructors

    _service: DeliveryService = Injector.Container.resolve(DeliveryService);

    _pregnancyService: PregnancyService = Injector.Container.resolve(PregnancyService);

    _postnatalVisitService: PostnatalVisitService = Injector.Container.resolve(PostnatalVisitService);

    _postnatalMedicationService: PostnatalMedicationService = Injector.Container.resolve(PostnatalMedicationService);

    _complicationService: ComplicationService = Injector.Container.resolve(ComplicationService);
    
    _babyService: BabyService = Injector.Container.resolve(BabyService);

    _breastfeedingService: BreastfeedingService = Injector.Container.resolve(BreastfeedingService);
    
    _validator: DeliveryValidator = new DeliveryValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Delivery methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            // Validate input and get model
            const model = await this._validator.create(request);
    
            // Fetch associated Pregnancy
            const pregnancy = await this._pregnancyService.getById(model.PregnancyId);
            if (!pregnancy) {
                throw new ApiError(404, 'Associated pregnancy not found with the given PregnancyId.');
            }
    
            // Create Delivery record
            const delivery = await this._service.create(model);
            if (delivery == null) {
                throw new ApiError(400, 'Cannot create record for delivery!');
            }
    
            // Prepare response with Pregnancy info
            const responseData = {
                ...delivery,
                Pregnancy: pregnancy
            };
    
            ResponseHandler.success(request, response, 'Delivery record created successfully!', 201, {
                Delivery: responseData,
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
            const delivery = await this._service.getById(model.DeliveryId);
            if (!delivery) {
                throw new ApiError(404, 'Associated delivery not found with the given DeliveryId.');
            }
    
            const postnatalVisit = await this._postnatalVisitService.create(model);
            if (postnatalVisit == null) {
                throw new ApiError(400, 'Cannot create record for postnatal visit!');
            }

            const responseData = {
                ...postnatalVisit,
                Delivery: delivery
            };
    
            ResponseHandler.success(request, response, 'Postnatal visit record created successfully!', 201, {
                PostnatalVisit: responseData,
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

    searchPostnatalVisits = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchPostnatalVisits(request);
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

    //#region Complication methods

    createComplication = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.createComplication(request); 
            const complication = await this._complicationService.create(model);
            if (complication == null) {
                throw new ApiError(400, 'Cannot create record for complication!');
            }

            ResponseHandler.success(request, response, 'Complication record created successfully!', 201, {
                Complication: complication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getComplicationById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const complicationId: uuid = await this._validator.getParamUuid(request, 'complicationId');
            const complication = await this._complicationService.getById(complicationId);
            if (complication == null) {
                throw new ApiError(404, 'Complication record not found.');
            }

            ResponseHandler.success(request, response, 'Complication record retrieved successfully!', 200, {
                Complication: complication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    searchComplications = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchComplications(request);
            const searchResults = await this._complicationService.search(filters);
            const count = searchResults.Items.length;
            const message = count === 0 ? 'No complication records found!' : `Total ${count} complication records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Complications: searchResults,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateComplication = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.updateComplication(request);
            const complicationId: uuid = await this._validator.getParamUuid(request, 'complicationId');
            const existingRecord = await this._complicationService.getById(complicationId);
            if (existingRecord == null) {
                throw new ApiError(404, 'Complication record not found.');
            }

            const updated = await this._complicationService.update(complicationId, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update complication record!');
            }

            ResponseHandler.success(request, response, 'Complication record updated successfully!', 200, {
                Complication: updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteComplication = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const complicationId: uuid = await this._validator.getParamUuid(request, 'complicationId');
            const existingRecord = await this._complicationService.getById(complicationId);
            if (existingRecord == null) {
                throw new ApiError(404, 'Complication record not found.');
            }

            const deleted = await this._complicationService.delete(complicationId);
            if (!deleted) {
                throw new ApiError(400, 'Complication record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Complication record deleted successfully!', 200, {
                Deleted: true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Baby

    createBaby = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.createBaby(request);
            const baby = await this._babyService.create(model);
            if (baby == null) {
                throw new ApiError(400, 'Cannot create record for baby!');
            }

            ResponseHandler.success(request, response, 'Baby record created successfully!', 201, {
                Baby: baby,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getBabyById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const babyId: uuid = await this._validator.getParamUuid(request, 'babyId');
            const baby = await this._babyService.getById(babyId);
            if (baby == null) {
                throw new ApiError(404, 'Baby record not found.');
            }

            ResponseHandler.success(request, response, 'Baby record retrieved successfully!', 200, {
                Baby: baby,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Breastfeeding

    createBreastfeeding = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.createBreastfeeding(request);
            const breastfeeding = await this._breastfeedingService.create(model);
            if (breastfeeding == null) {
                throw new ApiError(400, 'Cannot create record for breastfeeding!');
            }

            ResponseHandler.success(request, response, 'Breastfeeding record created successfully!', 201, {
                Breastfeeding: breastfeeding,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getBreastfeedingById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const breastfeedingId: uuid = await this._validator.getParamUuid(request, 'breastfeedingId');
            const breastfeeding = await this._breastfeedingService.getById(breastfeedingId);
            if (breastfeeding == null) {
                throw new ApiError(404, 'Breastfeeding record not found.');
            }

            ResponseHandler.success(request, response, 'Breastfeeding record retrieved successfully!', 200, {
                Breastfeeding: breastfeeding,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateBreastfeeding = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.updateBreastfeeding(request);
            const breastfeedingId: uuid = await this._validator.getParamUuid(request, 'breastfeedingId');
            const existingRecord = await this._breastfeedingService.getById(breastfeedingId);
            if (existingRecord == null) {
                throw new ApiError(404, 'Breastfeeding record not found.');
            }

            const updated = await this._breastfeedingService.update(breastfeedingId, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update breastfeeding record!');
            }

            ResponseHandler.success(request, response, 'Breastfeeding record updated successfully!', 200, {
                Breastfeeding: updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
