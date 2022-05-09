import express from 'express';
import { MedicationConsumptionValidator } from '../../../../api/validators/clinical/medication/medication.consumption.validator';
import { BaseController } from '../../../../../src/api/controllers/base.controller';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { SchedulesForDayDto } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { DrugService } from '../../../../services/clinical/medication/drug.service';
import { MedicationConsumptionService } from '../../../../services/clinical/medication/medication.consumption.service';
import { MedicationService } from '../../../../services/clinical/medication/medication.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { UserService } from '../../../../services/user/user.service';
import { Loader } from '../../../../startup/loader';
///////////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionController extends BaseController{

    //#region member variables and constructors

    _service: MedicationConsumptionService = null;

    _validator: MedicationConsumptionValidator = new MedicationConsumptionValidator();

    _medicationService: MedicationService = null;

    _patientService: PatientService = null;

    _userService: UserService = null;

    _drugService: DrugService = null;

    _authorizer: Authorizer = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(MedicationConsumptionService);

    }

    //#endregion

    //#region Action methods

    markListAsTaken = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.MarkListAsTaken', request, response);

            const consumptionIds = await this._validator.checkConsumptionIds(request);
            if (consumptionIds.length === 0) {
                throw new ApiError(422, `Medication consumption ids list is either empty or missing.`);
            }
            const dtos = await this._service.markListAsTaken(consumptionIds);
            if (dtos.length === 0) {
                throw new ApiError(422, `Unable to update medication consumptions.`);
            }
            
            ResponseHandler.success(request, response, 'Medication consumptions marked as taken successfully!', 200, {
                MedicationConsumptions : dtos,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    markListAsMissed = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.MarkListAsMissed', request, response);

            const consumptionIds = await this._validator.checkConsumptionIds(request);
            if (consumptionIds.length === 0) {
                throw new ApiError(422, `Medication consumption ids list is either empty or missing.`);
            }
            const dtos = await this._service.markListAsMissed(consumptionIds);
            if (dtos.length === 0) {
                throw new ApiError(422, `Unable to update medication consumptions.`);
            }
            
            ResponseHandler.success(request, response, 'Medication consumptions marked as missed successfully!', 200, {
                MedicationConsumptions : dtos,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    markAsTaken = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.MarkAsTaken', request, response);

            const consumptionId = await this._validator.getParam(request, 'id');
            const dto = await this._service.markAsTaken(consumptionId);
            if (dto === null) {
                throw new ApiError(422, `Unable to update medication consumption.`);
            }
            
            ResponseHandler.success(request, response, 'Medication consumptions marked as taken successfully!', 200, {
                MedicationConsumption : dto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    markAsMissed = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.MarkAsMissed', request, response);

            const consumptionId = await this._validator.getParam(request, 'id');
            const dto = await this._service.markAsMissed(consumptionId);
            if (dto === null) {
                throw new ApiError(422, `Unable to update medication consumption.`);
            }
            
            ResponseHandler.success(request, response, 'Medication consumptions marked as missed successfully!', 200, {
                MedicationConsumption : dto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteFutureMedicationSchedules = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.DeleteFutureMedicationSchedules', request, response);

            const medicationId = await this._validator.getParam(request, 'medicationId');
            const deletedCount = await this._service.deleteFutureMedicationSchedules(medicationId);
            
            ResponseHandler.success(request, response, 'Deleted future medication schedules successfully!', 200, {
                Deleted      : true,
                DeletedCount : deletedCount
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    // updateTimeZoneForFutureMedicationSchedules = async (request: express.Request, response: express.Response)
    //     : Promise<void> => {
    //     try {
    // eslint-disable-next-line max-len
    //         await this.setContext('MedicationConsumption.UpdateFutureMedicationSchedulesForTimeZone', request, response);
    //

    //         const medicationId = await this._validator.getParam(request, 'medicationId');
    //         const newTimeZone = await this._validator.getParam(request, 'newTimeZone');

    //         const dtos = await this._service.updateTimeZoneForFutureMedicationSchedules(medicationId, newTimeZone);
    //         if (dtos === null) {
    //             throw new ApiError(422, `Unable to delete medication consumptions.`);
    //         }
            
    //         ResponseHandler.success(request, response,
    //              'Updated time-zone for future medication schedules successfully!', 200, {
    //             MedicationConsumptions : dtos,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.GetById', request, response);

            const id: string = await this._validator.getParam(request, 'id');

            const medicationConsumption = await this._service.getById(id);
            if (medicationConsumption == null) {
                throw new ApiError(404, 'Medication consumption not found.');
            }

            ResponseHandler.success(request, response, 'Medication consumption retrieved successfully!', 200, {
                MedicationConsumption : medicationConsumption,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    searchForPatient = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.Search', request, response);

            const filters = await this._validator.searchForPatient(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} medication consumption records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { MedicationConsumptions: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getScheduleForDuration = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.GetMedicationSchedule', request, response);

            const model = await this._validator.getScheduleForDuration(request);

            const dtos = await this._service.getScheduleForDuration(
                model.PatientUserId,
                model.Duration,
                model.When);

            if (dtos.length === 0) {
                throw new ApiError(404, 'Medication consumptions not found.');
            }

            ResponseHandler.success(request, response, 'Medication consumptions retrieved successfully!', 200, {
                MedicationConsumptions : dtos,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getScheduleForDay = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.GetMedicationScheduleForDay', request, response);

            const model = await this._validator.getScheduleForDay(request);

            const schedules: SchedulesForDayDto = await this._service.getSchedulesForDay(
                model.PatientUserId,
                model.Date);

            if (schedules.Schedules.length === 0) {
                throw new ApiError(404, 'Medication consumption schedules for day not found.');
            }

            ResponseHandler.success(request, response, 'Medication consumptions retrieved successfully!', 200, {
                MedicationSchedulesForDay : schedules,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getSummaryForDay = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.GetMedicationConsumptionSummaryForDay', request, response);

            const model = await this._validator.getSummaryForDay(request);

            const summary = await this._service.getSchedulesForDayByDrugs(
                model.PatientUserId,
                model.Date);

            if (summary === null) {
                throw new ApiError(404, 'Medication consumption summary cannot be retrieved.');
            }

            ResponseHandler.success(request, response, 'Medication consumption summary retrieved successfully!', 200, {
                MedicationConsumptionSummary : summary,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getSummaryByCalendarMonths = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('MedicationConsumption.GetSummaryByCalendarMonths', request, response);

            const model = await this._validator.getSummaryByCalendarMonths(request);

            const summary = await this._service.getSummaryByCalendarMonths(
                model.PatientUserId,
                model.PastMonthsCount,
                model.FutureMonthsCount);

            if (summary === null) {
                throw new ApiError(404, 'Monthly medication consumption summary cannot be retrieved.');
            }

            ResponseHandler.success(request, response, 'Monthly medication consumption summary retrieved successfully!', 200, {
                MedicationConsumptionSummary : summary,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
