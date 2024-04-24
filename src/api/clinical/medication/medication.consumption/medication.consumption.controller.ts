import express from 'express';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { SchedulesForDayDto } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { DrugService } from '../../../../services/clinical/medication/drug.service';
import { MedicationConsumptionService } from '../../../../services/clinical/medication/medication.consumption.service';
import { MedicationService } from '../../../../services/clinical/medication/medication.service';
import { UserService } from '../../../../services/users/user/user.service';
import { Injector } from '../../../../startup/injector';
import { MedicationConsumptionValidator } from './medication.consumption.validator';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { TimeHelper } from '../../../../common/time.helper';
import { EHRMedicationService } from '../../../../modules/ehr.analytics/ehr.services/ehr.medication.service';
import { BaseController } from '../../../../api/base.controller';
import { MedicationConsumptionSearchFilters } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionController extends BaseController {

    //#region member variables and constructors

    _service: MedicationConsumptionService = Injector.Container.resolve(MedicationConsumptionService);

    _medicationService: MedicationService = Injector.Container.resolve(MedicationService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _drugService: DrugService = Injector.Container.resolve(DrugService);

    _ehrMedicationService: EHRMedicationService = Injector.Container.resolve(EHRMedicationService);

    //#endregion

    //#region Action methods

    markListAsTaken = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const consumptionIds = await MedicationConsumptionValidator.checkConsumptionIds(request);
            if (consumptionIds.length === 0) {
                throw new ApiError(422, `Medication consumption ids list is either empty or missing.`);
            }
            const dtos = await this._service.markListAsTaken(consumptionIds);
            if (dtos.length === 0) {
                throw new ApiError(422, `Unable to update medication consumptions.`);
            }
            await this.authorizeOne(request, dtos[0].PatientUserId);
            // get user details to add records in ehr database
            for (var dto of dtos) {
                await this._ehrMedicationService.addEHRMedicationConsumptionForAppNames(dto);
            }
            const patientUserId = dtos.length > 0 ? dtos[0].PatientUserId : null;
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            for (var dto of dtos) {
                const tempDate = TimeHelper.addDuration(dto.TimeScheduleEnd, offsetMinutes, DurationType.Minute);
                AwardsFactsService.addOrUpdateMedicationFact({
                    PatientUserId : dto.PatientUserId,
                    Facts         : {
                        DrugName : dto.DrugName,
                        Taken    : true,
                        Missed   : false,
                    },
                    RecordId       : dto.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(dto.TimeScheduleEnd),
                    RecordTimeZone : currentTimeZone,
                });
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
            const consumptionIds = await MedicationConsumptionValidator.checkConsumptionIds(request);
            if (consumptionIds.length === 0) {
                throw new ApiError(422, `Medication consumption ids list is either empty or missing.`);
            }
            const dtos = await this._service.markListAsMissed(consumptionIds);
            if (dtos.length === 0) {
                throw new ApiError(422, `Unable to update medication consumptions.`);
            }
            await this.authorizeOne(request, dtos[0].PatientUserId);
            for (var dto of dtos) {
                await this._ehrMedicationService.addEHRMedicationConsumptionForAppNames(dto);
            }

            const patientUserId = dtos.length > 0 ? dtos[0].PatientUserId : null;
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            for (var dto of dtos) {
                const tempDate = TimeHelper.addDuration(dto.TimeScheduleEnd, offsetMinutes, DurationType.Minute);
                AwardsFactsService.addOrUpdateMedicationFact({
                    PatientUserId : dto.PatientUserId,
                    Facts         : {
                        DrugName : dto.DrugName,
                        Taken    : false,
                        Missed   : true,
                    },
                    RecordId       : dto.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(dto.TimeScheduleEnd),
                    RecordTimeZone : currentTimeZone,
                });
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
            const consumptionId = await MedicationConsumptionValidator.getParam(request, 'id');
            const dto = await this._service.markAsTaken(consumptionId);
            if (dto === null) {
                throw new ApiError(422, `Unable to update medication consumption.`);
            }
            await this.authorizeOne(request, dto.PatientUserId);
            await this._ehrMedicationService.addEHRMedicationConsumptionForAppNames(dto);

            const patientUserId = dto.PatientUserId;
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const tempDateStr = TimeHelper.formatDateToLocal_YYYY_MM_DD(dto.TimeScheduleEnd);
            const tempDate = TimeHelper.addDuration(dto.TimeScheduleEnd, offsetMinutes, DurationType.Minute);
            AwardsFactsService.addOrUpdateMedicationFact({
                PatientUserId : dto.PatientUserId,
                Facts         : {
                    DrugName : dto.DrugName,
                    Taken    : true,
                    Missed   : false,
                },
                RecordId       : dto.id,
                RecordDate     : tempDate,
                RecordDateStr  : tempDateStr,
                RecordTimeZone : currentTimeZone,
            });

            ResponseHandler.success(request, response, 'Medication consumptions marked as taken successfully!', 200, {
                MedicationConsumption : dto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    markAsMissed = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const consumptionId = await MedicationConsumptionValidator.getParam(request, 'id');
            const dto = await this._service.markAsMissed(consumptionId);
            if (dto === null) {
                throw new ApiError(422, `Unable to update medication consumption.`);
            }
            await this.authorizeOne(request, dto.PatientUserId);
            await this._ehrMedicationService.addEHRMedicationConsumptionForAppNames(dto);

            const patientUserId = dto.PatientUserId;
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const tempDate = TimeHelper.addDuration(dto.TimeScheduleEnd, offsetMinutes, DurationType.Minute);
            AwardsFactsService.addOrUpdateMedicationFact({
                PatientUserId : dto.PatientUserId,
                Facts         : {
                    DrugName : dto.DrugName,
                    Taken    : false,
                    Missed   : true,
                },
                RecordId       : dto.id,
                RecordDate     : tempDate,
                RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(dto.TimeScheduleEnd),
                RecordTimeZone : currentTimeZone,
            });

            ResponseHandler.success(request, response, 'Medication consumptions marked as missed successfully!', 200, {
                MedicationConsumption : dto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteFutureMedicationSchedules = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const medicationId = await MedicationConsumptionValidator.getParam(request, 'medicationId');
            const medication = await this._medicationService.getById(medicationId);
            if (medication == null) {
                throw new ApiError(404, 'Medication not found.');
            }
            await this.authorizeOne(request, medication.PatientUserId);
            const deletedCount = await this._service.deleteFutureMedicationSchedules(medicationId);

            ResponseHandler.success(request, response, 'Deleted future medication schedules successfully!', 200, {
                Deleted      : true,
                DeletedCount : deletedCount
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await MedicationConsumptionValidator.getParam(request, 'id');

            const medicationConsumption = await this._service.getById(id);
            if (medicationConsumption == null) {
                throw new ApiError(404, 'Medication consumption not found.');
            }
            await this.authorizeOne(request, medicationConsumption.PatientUserId);
            ResponseHandler.success(request, response, 'Medication consumption retrieved successfully!', 200, {
                MedicationConsumption : medicationConsumption,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    searchForPatient = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            let filters = await MedicationConsumptionValidator.searchForPatient(request);
            filters = await this.authorizeSearch(request, filters);
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
            const model = await MedicationConsumptionValidator.getScheduleForDuration(request);
            await this.authorizeOne(request, model.PatientUserId);
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
            const model = await MedicationConsumptionValidator.getScheduleForDay(request);
            await this.authorizeOne(request, model.PatientUserId);
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
            const model = await MedicationConsumptionValidator.getSummaryForDay(request);
            await this.authorizeOne(request, model.PatientUserId);
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
            const model = await MedicationConsumptionValidator.getSummaryByCalendarMonths(request);
            await this.authorizeOne(request, model.PatientUserId);
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

    private authorizeSearch = async (
        request: express.Request,
        searchFilters: MedicationConsumptionSearchFilters): Promise<MedicationConsumptionSearchFilters> => {

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
