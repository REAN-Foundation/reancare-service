import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { FoodComponentMonitoringService } from '../../../../services/wellness/food.component.monitoring/food.component.monitoring.service';
import { FoodComponentMonitoringValidator } from './food.component.monitoring.validator';
import { Injector } from '../../../../startup/injector';
import { BaseController } from '../../../../api/base.controller';
import { FoodComponentMonitoringSearchFilters } from '../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodComponentMonitoringController extends BaseController {

    //#region member variables and constructors

    _service: FoodComponentMonitoringService = Injector.Container.resolve(FoodComponentMonitoringService);

    _validator: FoodComponentMonitoringValidator = new FoodComponentMonitoringValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);

            const foodComponentMonitoring = await this._service.create(model);
            if (foodComponentMonitoring == null) {
                throw new ApiError(400, 'Cannot create record for food component monitoring!');
            }
            await this.authorizeOne(request, foodComponentMonitoring.PatientUserId, null);
            ResponseHandler.success(request, response, 'Food component monitoring record created successfully!', 201, {
                FoodComponentMonitoring : foodComponentMonitoring,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const foodComponentMonitoring = await this._service.getById(id);
            if (foodComponentMonitoring == null) {
                throw new ApiError(404, 'Food component monitoring record not found.');
            }
            await this.authorizeOne(request, foodComponentMonitoring.PatientUserId, null);
            ResponseHandler.success(request, response, 'Food component monitoring record retrieved successfully!', 200, {
                FoodComponentMonitoring : foodComponentMonitoring,
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
                    : `Total ${count} food component monitoring records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                FoodComponentMonitoringRecords : searchResults });

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
                throw new ApiError(404, 'Food component monitoring record not found.');
            }
            await this.authorizeOne(request, existingRecord.PatientUserId, null);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update food component monitoring record!');
            }

            ResponseHandler.success(request, response, 'Food component monitoring record updated successfully!', 200, {
                FoodComponentMonitoring : updated,
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
                throw new ApiError(404, 'Food component monitoring record not found.');
            }
            await this.authorizeOne(request, existingRecord.PatientUserId, null);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Food component monitoring record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Food component monitoring record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    authorizeSearch = async (
        request: express.Request,
        searchFilters: FoodComponentMonitoringSearchFilters): Promise<FoodComponentMonitoringSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.PatientUserId != null) {
            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                const hasConsent = PermissionHandler.checkConsent(
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
