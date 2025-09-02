import express from 'express';
import fs from 'fs';
import { Helper } from '../../../../common/helper';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { DrugDomainModel } from '../../../../domain.types/clinical/medication/drug/drug.domain.model';
import { MedicationStockImageDto } from '../../../../domain.types/clinical/medication/medication.stock.image/medication.stock.image.dto';
import { MedicationDomainModel } from '../../../../domain.types/clinical/medication/medication/medication.domain.model';
import { ConsumptionSummaryDto, MedicationDto } from '../../../../domain.types/clinical/medication/medication/medication.dto';
import {
    MedicationAdministrationRoutesList,
    MedicationDosageUnitsList,
    MedicationDurationUnitsList,
    MedicationFrequencyUnitsList,
    MedicationTimeSchedulesList
} from '../../../../domain.types/clinical/medication/medication/medication.types';
import { DrugService } from '../../../../services/clinical/medication/drug.service';
import { MedicationConsumptionService } from '../../../../services/clinical/medication/medication.consumption.service';
import { MedicationService } from '../../../../services/clinical/medication/medication.service';
import { FileResourceService } from '../../../../services/general/file.resource.service';
import { UserService } from '../../../../services/users/user/user.service';
import { Injector } from '../../../../startup/injector';
import { MedicationValidator } from './medication.validator';
import { EHRMedicationService } from '../../../../modules/ehr.analytics/ehr.services/ehr.medication.service';
import { Logger } from '../../../../common/logger';
import { BaseController } from '../../../../api/base.controller';
import { MedicationSearchFilters } from '../../../../domain.types/clinical/medication/medication/medication.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { MedicationEvents } from './medication.events';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationController extends BaseController{

    //#region member variables and constructors

    _service: MedicationService = Injector.Container.resolve(MedicationService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _drugService: DrugService = Injector.Container.resolve(DrugService);

    _fileResourceService: FileResourceService = Injector.Container.resolve(FileResourceService);

    _medicationConsumptionService: MedicationConsumptionService = Injector.Container.resolve(MedicationConsumptionService);

    _ehrMedicationService: EHRMedicationService = Injector.Container.resolve(EHRMedicationService);

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
            const domainModel = await MedicationValidator.create(request);
            await this.authorizeOne(request, domainModel.PatientUserId);
            const user = await this._userService.getById(domainModel.PatientUserId);

            if (user == null) {
                throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
            }

            await this.updateDrugDetails(domainModel);

            var medication = await this._service.create(domainModel);
            Logger.instance().log(`[MedicationTime] Create - service call completed`);

            if (medication == null) {
                throw new ApiError(400, 'Cannot create medication!');
            }
            if (medication.FrequencyUnit !== 'Other') {
                var stats = await this._medicationConsumptionService.create(medication);
                var doseValue = Helper.parseIntegerFromString(medication.Dose.toString()) ?? 1;

                var consumptionSummary: ConsumptionSummaryDto = {
                    TotalConsumptionCount   : stats.TotalConsumptionCount,
                    TotalDoseCount          : stats.TotalConsumptionCount * doseValue,
                    PendingConsumptionCount : stats.PendingConsumptionCount,
                    PendingDoseCount        : stats.PendingConsumptionCount * doseValue,
                };

                medication.ConsumptionSummary = consumptionSummary;
            }

            var medicationConsumptions = await this._medicationConsumptionService.getByMedicationId(medication.id);
            for await (var mc of medicationConsumptions) {
                await this._ehrMedicationService.addEHRMedicationConsumptionForAppNames(mc);
            }
            
            MedicationEvents.onMedicationCreated(request, medication);
            ResponseHandler.success(request, response, 'Medication created successfully!', 201, {
                Medication : medication,
            });

        } catch (error) {
            Logger.instance().log(`[MedicationTime] Create - error occured`);
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await MedicationValidator.getParamId(request);
            const medication = await this._service.getById(id);
            if (medication == null) {
                throw new ApiError(404, 'Medication not found.');
            }
            await this.authorizeOne(request, medication.PatientUserId);
            var stats = await this._medicationConsumptionService.getConsumptionStatusForMedication(id);
            var doseValue = Helper.parseIntegerFromString(medication.Dose.toString()) ?? 1;

            var consumptionSummary: ConsumptionSummaryDto = {
                TotalConsumptionCount   : stats.TotalConsumptionCount,
                TotalDoseCount          : stats.TotalConsumptionCount * doseValue,
                PendingConsumptionCount : stats.PendingConsumptionCount,
                PendingDoseCount        : stats.PendingConsumptionCount * doseValue,
            };

            medication.ConsumptionSummary = consumptionSummary;

            Logger.instance().log(`[MedicationTime] GetById - medication response returned`);
            ResponseHandler.success(request, response, 'Medication retrieved successfully!', 200, {
                Medication : medication,
            });
        } catch (error) {
            Logger.instance().log(`[MedicationTime] GetById - error occured`);
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await MedicationValidator.search(request);
            await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} medication records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, { Medications: searchResults });
        } catch (error) {
            Logger.instance().log(`[MedicationTime] Search - error occured`);
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            Logger.instance().log(`[MedicationTime] Update - API call started`);
            const domainModel = await MedicationValidator.update(request);
            const id: string = await MedicationValidator.getParamId(request);

            const existingMedication = await this._service.getById(id);
            if (existingMedication == null) {
                throw new ApiError(404, 'Medication not found.');
            }
            await this.authorizeOne(request, existingMedication.PatientUserId);
            const startDate =
                await this._userService.getDateInUserTimeZone(existingMedication.PatientUserId, request.body.StartDate);
            domainModel.StartDate = startDate;

            const updated = await this._service.update(id, domainModel);
            Logger.instance().log(`[MedicationTime] Update - service call completed`);

            if (updated == null) {
                throw new ApiError(400, 'Unable to update medication record!');
            }

            this.updateMedicationConsumption(domainModel, id, updated);

            MedicationEvents.onMedicationUpdated(request, updated);

            ResponseHandler.success(request, response, 'Medication record updated successfully! Updates will be available shortly.', 200, {
                Medication : updated,
            });
        } catch (error) {
            Logger.instance().log(`[MedicationTime] Update - error occured`);
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await MedicationValidator.getParamId(request);
            const existingMedication = await this._service.getById(id);
            if (existingMedication == null) {
                throw new ApiError(404, 'Medication not found.');
            }
            await this.authorizeOne(request, existingMedication.PatientUserId);
            const deleted = await this._service.delete(id);
            Logger.instance().log(`[MedicationTime] Delete - service call completed`);

            if (!deleted) {
                throw new ApiError(400, 'Medication cannot be deleted.');
            }

            await this._medicationConsumptionService.deleteFutureMedicationSchedules(id, true);

            // delete ehr record
            this._ehrMedicationService.deleteMedicationEHRRecords(id);

            MedicationEvents.onMedicationDeleted(request, existingMedication);
            ResponseHandler.success(request, response, 'Medication record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            Logger.instance().log(`[MedicationTime] Delete - error occured`);
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCurrentMedications = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const patientUserId: string = await MedicationValidator.getPatientUserId(request);
            await this.authorizeOne(request, patientUserId);
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

    private async updateMedicationConsumption(domainModel: MedicationDomainModel, id: string, updated: MedicationDto) {
        if (domainModel.DrugId !== null ||
            domainModel.RefillCount !== null ||
            domainModel.RefillNeeded !== null ||
            domainModel.Duration !== null ||
            domainModel.DurationUnit !== null ||
            domainModel.Frequency !== null ||
            domainModel.FrequencyUnit !== null ||
            domainModel.TimeSchedules !== null ||
            domainModel.StartDate !== null) {

            await this._medicationConsumptionService.deleteFutureMedicationSchedules(id, true);

            if (updated.FrequencyUnit !== 'Other') {
                await this._medicationConsumptionService.create(updated);

                /*var doseValue = Helper.parseIntegerFromString(updated.Dose.toString()) ?? 1;

                var consumptionSummary: ConsumptionSummaryDto = {
                    TotalConsumptionCount   : stats.TotalConsumptionCount,
                    TotalDoseCount          : stats.TotalConsumptionCount * doseValue,
                    PendingConsumptionCount : stats.PendingConsumptionCount,
                    PendingDoseCount        : stats.PendingConsumptionCount * doseValue,
                };

                updated.ConsumptionSummary = consumptionSummary;*/
            }

        }

    }

    private authorizeSearch = async (
        request: express.Request,
        searchFilters: MedicationSearchFilters): Promise<MedicationSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.PatientUserId != null) {
            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.PatientUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.PatientUserId = currentUser.UserId;
        }
        return searchFilters;
    };

    //#endregion

}
