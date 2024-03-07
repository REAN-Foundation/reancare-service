import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { UserService } from '../../../../services/users/user/user.service';
import { PhysicalActivityService } from '../../../../services/wellness/exercise/physical.activity.service';
import { Injector } from '../../../../startup/injector';
import { PhysicalActivityValidator } from './physical.activity.validator';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { EHRPhysicalActivityService } from '../../../../modules/ehr.analytics/ehr.services/ehr.physical.activity.service';

///////////////////////////////////////////////////////////////////////////////////////

export class PhysicalActivityController {

    //#region member variables and constructors

    _validator: PhysicalActivityValidator = new PhysicalActivityValidator();

    _service = Injector.Container.resolve(PhysicalActivityService);

    _userService = Injector.Container.resolve(UserService);

    _ehrPhysicalActivityService: EHRPhysicalActivityService = Injector.Container.resolve(EHRPhysicalActivityService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const physicalActivity = await this._service.create(domainModel);
            if (physicalActivity == null) {
                throw new ApiError(400, 'Cannot create physical activity record!');
            }
            
            await this._ehrPhysicalActivityService.addEHRRecordPhysicalActivityForAppNames(physicalActivity);

            // Adding record to award service
            if (physicalActivity.PhysicalActivityQuestionAns) {
                var timestamp = physicalActivity.EndTime ?? physicalActivity.StartTime;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(physicalActivity.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);
                const currentTimeZone = await HelperRepo.getPatientTimezone(physicalActivity.PatientUserId);

                AwardsFactsService.addOrUpdatePhysicalActivityResponseFact({
                    PatientUserId : physicalActivity.PatientUserId,
                    Facts         : {
                        PhysicalActivityQuestionAns : physicalActivity.PhysicalActivityQuestionAns,
                    },
                    RecordId       : physicalActivity.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            ResponseHandler.success(request, response, 'Physical activity record created successfully!', 201, {
                PhysicalActivity : physicalActivity,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const physicalActivity = await this._service.getById(id);
            if (physicalActivity == null) {
                throw new ApiError(404, 'Physical activity record not found.');
            }

            ResponseHandler.success(request, response, 'Physical activity record retrieved successfully!', 200, {
                PhysicalActivity : physicalActivity,
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
                    : `Total ${count} Physical activity records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { PhysicalActivities: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const physicalActivity = await this._service.getById(id);
            if (physicalActivity == null) {
                throw new ApiError(404, 'Physical activity record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update physical activity record!');
            }

            await this._ehrPhysicalActivityService.addEHRRecordPhysicalActivityForAppNames(physicalActivity);

            if (updated.PhysicalActivityQuestionAns !== null) {
                var timestamp = updated.CreatedAt ?? updated.EndTime ?? updated.StartTime;
                if (!timestamp) {
                    timestamp = new Date();
                }
                //const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(updated.PatientUserId);
                //const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);
                AwardsFactsService.addOrUpdatePhysicalActivityResponseFact({
                    PatientUserId : updated.PatientUserId,
                    Facts         : {
                        PhysicalActivityQuestionAns : updated.PhysicalActivityQuestionAns,
                    },
                    RecordId      : updated.id,
                    RecordDate    : timestamp,
                    RecordDateStr : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                });
            }

            ResponseHandler.success(request, response, 'Physical activity record updated successfully!', 200, {
                PhysicalActivity : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const physicalActivity = await this._service.getById(id);
            if (physicalActivity == null) {
                throw new ApiError(404, 'Physical activity record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Physical activity record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Physical activity record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
