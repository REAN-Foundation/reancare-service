import express from 'express';
import fs from 'fs';
import mime from 'mime';
import { MedicationStockImageDto } from '../../../..//domain.types/clinical/medication/medication.stock.image/medication.stock.image.dto';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { DrugService } from '../../../../services/clinical/medication/drug.service';
import { MedicationService } from '../../../../services/clinical/medication/medication.service';
import { FileResourceService } from '../../../../services/file.resource.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { UserService } from '../../../../services/user/user.service';
import { Loader } from '../../../../startup/loader';
import { MedicationValidator } from '../../../validators/medication.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationController {

    //#region member variables and constructors

    _service: MedicationService = null;

    _patientService: PatientService = null;

    _userService: UserService = null;

    _drugService: DrugService = null;

    _fileResourceService: FileResourceService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(MedicationService);
        this._patientService = Loader.container.resolve(PatientService);
        this._userService = Loader.container.resolve(UserService);
        this._drugService = Loader.container.resolve(DrugService);
        this._fileResourceService = Loader.container.resolve(FileResourceService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await MedicationValidator.create(request);

            const user = await this._userService.getById(domainModel.PatientUserId);
            if (user == null) {
                throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
            }
            const drug = await this._userService.getById(domainModel.DrugId);
            if (drug == null) {
                throw new ApiError(404, `Drug with an id ${domainModel.DrugId} cannot be found.`);
            }

            const medication = await this._service.create(domainModel);
            if (medication == null) {
                throw new ApiError(400, 'Cannot create medication!');
            }

            ResponseHandler.success(request, response, 'Medication created successfully!', 201, {
                Medication : medication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await MedicationValidator.getById(request);

            const medication = await this._service.getById(id);
            if (medication == null) {
                throw new ApiError(404, 'Medication not found.');
            }

            ResponseHandler.success(request, response, 'Medication retrieved successfully!', 200, {
                Medication : medication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Search';
            await this._authorizer.authorize(request, response);

            const filters = await MedicationValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} medication records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { Medications: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await MedicationValidator.update(request);
            const id: string = await MedicationValidator.getById(request);

            const existingMedication = await this._service.getById(id);
            if (existingMedication == null) {
                throw new ApiError(404, 'Medication not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update medication record!');
            }

            ResponseHandler.success(request, response, 'Medication record updated successfully!', 200, {
                Medication : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await MedicationValidator.getById(request);
            const existingMedication = await this._service.getById(id);
            if (existingMedication == null) {
                throw new ApiError(404, 'Medication not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Medication cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Medication record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCurrentMedications = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.GetCurrentMedications';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const patientUserId: string = await MedicationValidator.getCurrentMedications(request);

            const medications = await this._service.getCurrentMedications(patientUserId);

            ResponseHandler.success(request, response, 'Current medications retrieved successfully!', 200, {
                CurrentMedications : medications,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getStockMedicationImages = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.GetStockMedicationImages';
            await this._authorizer.authorize(request, response);

            const images = await this._service.getStockMedicationImages();

            ResponseHandler.success(request, response, 'Medication stock images retrieved successfully!', 200, {
                MedicationStockImages : images,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getStockMedicationImageById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.GetStockMedicationImageById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const imageId: string = await MedicationValidator.getImageId(request);
            const image: MedicationStockImageDto = await this._service.getStockMedicationImageById(imageId);
            if (image == null) {
                throw new ApiError(404, 'Medication stock image not found.');
            }
            ResponseHandler.success(request, response, 'Medication retrieved successfully!', 200, {
                MedicationStockImage : image,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    downloadStockMedicationImageById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.DownloadStockMedicationImageById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const imageId: string = await MedicationValidator.getImageId(request);
            const image: MedicationStockImageDto = await this._service.getStockMedicationImageById(imageId);
            if (image == null) {
                throw new ApiError(404, 'Medication stock image not found.');
            }

            const localDestination = await this._fileResourceService.downloadById(image.ResourceId);
            if (localDestination == null) {
                throw new ApiError(404, 'File resource not found.');
            }
    
            var mimeType = mime.lookup(localDestination);
            response.setHeader('Content-type', mimeType);
            response.setHeader('Content-disposition', 'inline');
            var filestream = fs.createReadStream(localDestination);
            filestream.pipe(response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
