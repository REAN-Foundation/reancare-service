import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { HowDoYouFeelService } from '../../../../services/clinical/symptom/how.do.you.feel.service';
import { Injector } from '../../../../startup/injector';
import { HowDoYouFeelValidator } from './how.do.you.feel.validator';
import { EHRHowDoYouFeelService } from '../../../../modules/ehr.analytics/ehr.services/ehr.how.do.you.feel.service';
import { BaseController } from '../../../../api/base.controller';
import { HowDoYouFeelSearchFilters } from '../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { HowDoYouFeelDomainModel } from '../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { UserService } from '../../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class HowDoYouFeelController extends BaseController {

    //#region member variables and constructors

    _service: HowDoYouFeelService = Injector.Container.resolve(HowDoYouFeelService);

    _validator: HowDoYouFeelValidator = new HowDoYouFeelValidator();

    _ehrHowDoYouFeelService: EHRHowDoYouFeelService = Injector.Container.resolve(EHRHowDoYouFeelService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: HowDoYouFeelDomainModel = await this._validator.create(request);
            await this.authorizeUser(request, model.PatientUserId);
            const howDoYouFeel = await this._service.create(model);
            if (howDoYouFeel == null) {
                throw new ApiError(400, 'Cannot create record for how do you feel!');
            }
            await this._ehrHowDoYouFeelService.addEHRHowDoYouFeelForAppNames(howDoYouFeel);
            ResponseHandler.success(request, response, 'How do you feel record created successfully!', 201, {
                HowDoYouFeel : howDoYouFeel,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const howDoYouFeel = await this._service.getById(id);
            if (howDoYouFeel == null) {
                throw new ApiError(404, 'How do you feel record not found.');
            }
            await this.authorizeUser(request, howDoYouFeel.PatientUserId);
            ResponseHandler.success(request, response, 'How do you feel record retrieved successfully!', 200, {
                HowDoYouFeel : howDoYouFeel,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters: HowDoYouFeelSearchFilters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} how do you feel records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { HowDoYouFeelRecords: searchResults });

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
                throw new ApiError(404, 'How do you feel record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update how do you feel record!');
            }

            await this._ehrHowDoYouFeelService.addEHRHowDoYouFeelForAppNames(updated);

            ResponseHandler.success(request, response, 'How do you feel record updated successfully!', 200, {
                HowDoYouFeel : updated,
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
                throw new ApiError(404, 'How do you feel record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'How do you feel record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'How do you feel record deleted successfully!', 200, {
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

    private authorizeSearch = async (
        request: express.Request,
        searchFilters: HowDoYouFeelSearchFilters): Promise<HowDoYouFeelSearchFilters> => {

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
