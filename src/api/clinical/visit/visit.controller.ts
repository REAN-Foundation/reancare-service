import express from 'express';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { VisitService } from '../../../services/clinical/visit.service';
import { VisitValidator } from './visit.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import { PermissionHandler } from '../../../auth/custom/permission.handler';
import { VisitSearchFilters } from '../../../domain.types/clinical/visit/visit.search.type';
import { VisitDomainModel } from '../../../domain.types/clinical/visit/visit.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class VisitController extends BaseController {

    //#region member variables and constructors

    _service: VisitService = Injector.Container.resolve(VisitService);

    _validator: VisitValidator = new VisitValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model: VisitDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId);
            const visit = await this._service.create(model);
            if (visit == null) {
                throw new ApiError(400, 'Cannot create record for visit!');
            }
            ResponseHandler.success(request, response, 'Visit record created successfully!', 201, {
                Visit : visit,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const visit = await this._service.getById(id);
            if (visit == null) {
                throw new ApiError(404, 'Visit record not found.');
            }
            await this.authorizeOne(request, visit.PatientUserId);
            ResponseHandler.success(request, response, 'Visit record retrieved successfully!', 200, {
                Visit : visit,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const filters: VisitSearchFilters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} visit records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                VisitRecords : searchResults });

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
                throw new ApiError(404, 'Visit record not found.');
            }
            await this.authorizeOne(request, existingRecord.PatientUserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update visit record!');
            }

            ResponseHandler.success(request, response, 'Visit record updated successfully!', 200, {
                Visit : updated,
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
                throw new ApiError(404, 'Visit record not found.');
            }
            await this.authorizeOne(request, existingRecord.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Visit record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Visit record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
    private authorizeSearch = async (
        request: express.Request,
        searchFilters: VisitSearchFilters): Promise<VisitSearchFilters> => {

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
