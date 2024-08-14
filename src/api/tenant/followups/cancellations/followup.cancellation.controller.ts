import { ResponseHandler } from "../../../../common/handlers/response.handler";
import { BaseController } from "../../../base.controller";
import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { FollowUpCancellationValidator } from "./followup.cancellation.validator";
import { Injector } from "../../../../startup/injector";
import { FollowUpCancellationService } from "../../../../services/tenant/followups/cancellations/follow.up.cancellation.service";
import { FollowUpCancellationSearchFilters } from "../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.search.types";

export class FollowUpCancellationController extends BaseController {

    _validator = new FollowUpCancellationValidator();

    _service: FollowUpCancellationService = Injector.Container.resolve(FollowUpCancellationService);

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.create(request);
            if (domainModel.CancelDate < new Date()) {
                throw new ApiError(400, `Invalid cancellation date.`);
            }
            await this.authorizeOne(request, null, domainModel.TenantId);
            const search: FollowUpCancellationSearchFilters = {
                TenantId   : domainModel.TenantId,
                CancelDate : domainModel.CancelDate
            };
            const followupCancellationSchedules = await this._service.search(search);

            if (followupCancellationSchedules.TotalCount) {
                throw new ApiError(409, `Cancellation of follow-up is already scheduled for the date: ${domainModel.CancelDate}`);
            }

            const cancellationDetails = await this._service.create(domainModel);
            if (!cancellationDetails) {
                throw new ApiError(400, `Unable to schedule follow-up cancellation for the date: ${domainModel.CancelDate}`);
            }

            ResponseHandler.success(request, response, 'Follow-up cancellation is schedule for the dates successfully!', 201, {
                FollowUpCancellation : cancellationDetails ,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const cancellationDetails = await this._service.getById(id);
            if (!cancellationDetails) {
                throw new ApiError(404, 'Follow-up cancellation details not found.');
            }
            await this.authorizeOne(request, null, cancellationDetails.TenantId);
            ResponseHandler.success(request, response, 'Follow-up cancellation details retrieved successfully!', 200, {
                FollowUpCancellation : cancellationDetails,
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
                    : `Total ${count} Follow-up cancellation records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { FollowUpCancellation: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.update(request);
            if (domainModel.CancelDate && domainModel.CancelDate < new Date()) {
                throw new ApiError(400, `Invalid cancellation date.`);
            }
            
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const exitingCancellationDetails = await this._service.getById(id);
            if (!exitingCancellationDetails) {
                throw new ApiError(404, 'Follow-up cancellation details not found.');
            }

            await this.authorizeOne(request, null, exitingCancellationDetails.TenantId);
            const filter: FollowUpCancellationSearchFilters = {
                TenantId   : exitingCancellationDetails.TenantId,
                CancelDate : domainModel.CancelDate
            };
            const followupCancellationSchedules = await this._service.search(filter);

            if (followupCancellationSchedules.TotalCount) {
                throw new ApiError(409, `Cancellation of follow-up is already scheduled for the date: ${domainModel.CancelDate}`);
            }
            
            const updated = await this._service.update(domainModel.id, domainModel);
            if (!updated) {
                throw new ApiError(400, 'Unable to update follow-up cancellation record!');
            }

            ResponseHandler.success(request, response, 'Follow-up cancellation updated successfully!', 200, {
                FollowUpCancellationDates : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingCancellationDetails = await this._service.getById(id);
            if (!existingCancellationDetails) {
                throw new ApiError(404, 'Follow-up cancellation details not found.');
            }
            await this.authorizeOne(request,null, existingCancellationDetails.TenantId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Follow-up cancellation cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Follow-up cancellation date deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private authorizeSearch = async (
        request: express.Request,
        searchFilters: FollowUpCancellationSearchFilters): Promise<FollowUpCancellationSearchFilters> => {

        if (searchFilters.TenantId != null) {
            if (searchFilters.TenantId !== request.currentUser.TenantId) {
                throw new ApiError(403, 'Forbidden');
            }
        }
        else {
            searchFilters.TenantId = request.currentUser.TenantId;
        }
        return searchFilters;
    };

}
