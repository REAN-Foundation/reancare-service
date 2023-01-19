import express from 'express';
import fs from 'fs';
import { Helper } from '../../../../common/helper';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { DrugDomainModel } from '../../../../domain.types/clinical/medication/drug/drug.domain.model';
import { MedicationStockImageDto } from '../../../../domain.types/clinical/medication/medication.stock.image/medication.stock.image.dto';
import { MedicationDomainModel } from '../../../../domain.types/clinical/medication/medication/medication.domain.model';
import { ConsumptionSummaryDto } from '../../../../domain.types/clinical/medication/medication/medication.dto';
import { MedicationAdministrationRoutesList, MedicationDosageUnitsList, MedicationDurationUnitsList, MedicationFrequencyUnitsList, MedicationTimeSchedulesList } from '../../../../domain.types/clinical/medication/medication/medication.types';
import { DrugService } from '../../../../services/clinical/medication/drug.service';
import { MedicationConsumptionService } from '../../../../services/clinical/medication/medication.consumption.service';
import { MedicationService } from '../../../../services/clinical/medication/medication.service';
import { FileResourceService } from '../../../../services/general/file.resource.service';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { UserService } from '../../../../services/users/user/user.service';
import { Loader } from '../../../../startup/loader';
import { MedicationValidator } from './medication.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationController {

    //#region member variables and constructors

    _service: MedicationService = null;

    _patientService: PatientService = null;

    _userService: UserService = null;

    _drugService: DrugService = null;

    _fileResourceService: FileResourceService = null;

    _medicationConsumptionService: MedicationConsumptionService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(MedicationService);
        this._patientService = Loader.container.resolve(PatientService);
        this._userService = Loader.container.resolve(UserService);
        this._drugService = Loader.container.resolve(DrugService);
        this._fileResourceService = Loader.container.resolve(FileResourceService);
        this._medicationConsumptionService = Loader.container.resolve(MedicationConsumptionService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    getTimeSchedules = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Medication time schedules retrieved successfully!', 200, {
                MedicationTimeSchedules : MedicationTimeSchedulesList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getFrequencyUnits = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Medication frequency units retrieved successfully!', 200, {
                MedicationFrequencyUnits : MedicationFrequencyUnitsList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getDosageUnits = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Medication dosage units retrieved successfully!', 200, {
                MedicationDosageUnits : MedicationDosageUnitsList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getDurationUnits = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Medication duration units retrieved successfully!', 200, {
                MedicationDurationUnits : MedicationDurationUnitsList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAdministrationRoutes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Medication administration routes retrieved successfully!', 200, {
                MedicationAdministrationRoutes : MedicationAdministrationRoutesList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Create';
            await this._authorizer.authorize(request, response);

            const domainModel = await MedicationValidator.create(request);

            const user = await this._userService.getById(domainModel.PatientUserId);
            if (user == null) {
                throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
            }

            await this.updateDrugDetails(domainModel);

            var medication = await this._service.create(domainModel);
            if (medication == null) {
                throw new ApiError(400, 'Cannot create medication!');
            }
            if (medication.FrequencyUnit !== 'Other') {
                var stats = await this._medicationConsumptionService.create(medication);

                var consumptionSummary: ConsumptionSummaryDto = {
                    TotalConsumptionCount   : stats.TotalConsumptionCount,
                    TotalDoseCount          : stats.TotalConsumptionCount * medication.Dose,
                    PendingConsumptionCount : stats.PendingConsumptionCount,
                    PendingDoseCount        : stats.PendingConsumptionCount * medication.Dose,
                };

                medication.ConsumptionSummary = consumptionSummary;
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

            await this._authorizer.authorize(request, response);

            const id: string = await MedicationValidator.getParamId(request);

            const medication = await this._service.getById(id);
            if (medication == null) {
                throw new ApiError(404, 'Medication not found.');
            }

            var stats = await this._medicationConsumptionService.getConsumptionStatusForMedication(id);

            var consumptionSummary: ConsumptionSummaryDto = {
                TotalConsumptionCount   : stats.TotalConsumptionCount,
                TotalDoseCount          : stats.TotalConsumptionCount * medication.Dose,
                PendingConsumptionCount : stats.PendingConsumptionCount,
                PendingDoseCount        : stats.PendingConsumptionCount * medication.Dose,
            };

            medication.ConsumptionSummary = consumptionSummary;

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
            const id: string = await MedicationValidator.getParamId(request);

            const existingMedication = await this._service.getById(id);
            if (existingMedication == null) {
                throw new ApiError(404, 'Medication not found.');
            }

            const startDate =
                await this._userService.getDateInUserTimeZone(existingMedication.PatientUserId, request.body.StartDate);
            domainModel.StartDate = startDate;

            const updated = await this._service.update(id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update medication record!');
            }

            if (domainModel.DrugId !== null ||
                domainModel.RefillCount !== null ||
                domainModel.RefillNeeded !== null ||
                domainModel.Duration !== null ||
                domainModel.DurationUnit !== null ||
                domainModel.Frequency !== null ||
                domainModel.FrequencyUnit !== null ||
                domainModel.TimeSchedules !== null ||
                domainModel.StartDate !== null) {

                await this._medicationConsumptionService.deleteFutureMedicationSchedules(id);

                if (updated.FrequencyUnit !== 'Other') {
                    var stats = await this._medicationConsumptionService.create(updated);
    
                    var consumptionSummary: ConsumptionSummaryDto = {
                        TotalConsumptionCount   : stats.TotalConsumptionCount,
                        TotalDoseCount          : stats.TotalConsumptionCount * updated.Dose,
                        PendingConsumptionCount : stats.PendingConsumptionCount,
                        PendingDoseCount        : stats.PendingConsumptionCount * updated.Dose,
                    };
    
                    updated.ConsumptionSummary = consumptionSummary;
                }
                
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

            const id: string = await MedicationValidator.getParamId(request);
            const existingMedication = await this._service.getById(id);
            if (existingMedication == null) {
                throw new ApiError(404, 'Medication not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Medication cannot be deleted.');
            }

            await this._medicationConsumptionService.deleteFutureMedicationSchedules(id);

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

            await this._authorizer.authorize(request, response);

            const patientUserId: string = await MedicationValidator.getPatientUserId(request);

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

            await this._authorizer.authorize(request, response);

            const imageId: number = await MedicationValidator.getParamImageId(request);
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

            await this._authorizer.authorize(request, response);

            const imageId: number = await MedicationValidator.getParamImageId(request);
            const image: MedicationStockImageDto = await this._service.getStockMedicationImageById(imageId);
            if (image == null) {
                throw new ApiError(404, 'Medication stock image not found.');
            }

            const localDestination = await this._fileResourceService.downloadById(image.ResourceId);
            if (localDestination == null) {
                throw new ApiError(404, 'File resource not found.');
            }

            var mimeType = Helper.getMimeType(localDestination);
            response.setHeader('Content-type', mimeType);
            response.setHeader('Content-disposition', 'inline');
            var filestream = fs.createReadStream(localDestination);
            filestream.pipe(response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#region Privates

    private async updateDrugDetails(domainModel: MedicationDomainModel) {
        if (domainModel.DrugId === null || domainModel.DrugId === undefined) {
            if (domainModel.DrugName) {
                var existingDrug = await this._drugService.getByName(domainModel.DrugName);
                if (existingDrug) {
                    domainModel.DrugId = existingDrug.id;
                }
                else {
                    var drugDomainModel: DrugDomainModel = {
                        DrugName : domainModel.DrugName
                    };
                    const drug = await this._drugService.create(drugDomainModel);
                    domainModel.DrugId = drug.id;
                }
            }
            else {
                throw new ApiError(404, `Drug for the medication is not specified.`);
            }
        }
        else {
            const drug = await this._drugService.getById(domainModel.DrugId);
            if (drug == null) {
                throw new ApiError(404, `Drug with an id ${domainModel.DrugId} cannot be found.`);
            }
            domainModel.DrugName = drug.DrugName;
        }
    }

    //#endregion

}
