import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { MeditationService } from '../../../../services/wellness/exercise/meditation.service';
import { Injector } from '../../../../startup/injector';
import { MeditationValidator } from './meditation.validator';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { EHRMentalWellBeingService } from '../../../../modules/ehr.analytics/ehr.services/ehr.mental.wellbeing.service';
import { BaseController } from '../../../../api/base.controller';
import { MeditationSearchFilters } from '../../../../domain.types/wellness/exercise/meditation/meditation.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { UserService } from '../../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class MeditationController extends BaseController {

    //#region member variables and constructors

    _service: MeditationService = Injector.Container.resolve(MeditationService);

    _validator: MeditationValidator = new MeditationValidator();

    _ehrMentalWellBeingService: EHRMentalWellBeingService = Injector.Container.resolve(EHRMentalWellBeingService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeUser(request, model.PatientUserId);
            const meditation = await this._service.create(model);
            if (meditation == null) {
                throw new ApiError(400, 'Cannot create record for meditation!');
            }

            await this._ehrMentalWellBeingService.addEHRMeditationForAppNames(meditation);
            if (meditation.DurationInMins) {
                var timestamp = meditation.EndTime ?? meditation.StartTime;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(meditation.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(meditation.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateMentalHealthResponseFact({
                    PatientUserId : meditation.PatientUserId,
                    Facts         : {
                        Name     : 'Meditation',
                        Duration : meditation.DurationInMins,
                        Unit     : 'mins'
                    },
                    RecordId       : meditation.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }

            ResponseHandler.success(request, response, 'Meditation record created successfully!', 201, {
                Meditation : meditation,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const meditation = await this._service.getById(id);
            if (meditation == null) {
                throw new ApiError(404, ' Meditation record not found.');
            }
            await this.authorizeUser(request, meditation.PatientUserId);
            ResponseHandler.success(request, response, 'Meditation record retrieved successfully!', 200, {
                Meditation : meditation,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} meditation records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                MeditationRecords : searchResults });

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
                throw new ApiError(404, 'Meditation record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update meditation record!');
            }

            await this._ehrMentalWellBeingService.addEHRMeditationForAppNames(updated);

            ResponseHandler.success(request, response, 'Meditation record updated successfully!', 200, {
                Meditation : updated,
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
                throw new ApiError(404, 'Meditation record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Meditation record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Meditation record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
    private authorizeUser = async (request: express.Request, ownerUserId: uuid) => {
        const _userService = Injector.Container.resolve(UserService);
        const user = await _userService.getById(ownerUserId);
        if (!user) {
            throw new ApiError(404, `User with Id ${ownerUserId} not found.`);
        }
        request.resourceOwnerUserId = ownerUserId;
        request.resourceTenantId = user.TenantId;
        await this.authorizeOne(request, ownerUserId, user.TenantId);
    };

    authorizeSearch = async (
        request: express.Request,
        searchFilters: MeditationSearchFilters): Promise<MeditationSearchFilters> => {

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

}
