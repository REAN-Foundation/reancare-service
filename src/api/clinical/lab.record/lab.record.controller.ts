import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { UserService } from '../../../services/users/user/user.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { LabRecordService } from '../../../services/clinical/lab.record/lab.record.service';
import { LabRecordValidator } from './lab.record.validator';
import { Injector } from '../../../startup/injector';
import { EHRLabService } from '../../../modules/ehr.analytics/ehr.services/ehr.lab.service';
import { BaseController } from '../../../api/base.controller';
import { LabRecordSearchFilters } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.search.types';
import { PermissionHandler } from '../../../auth/custom/permission.handler';
import { LabRecordDomainModel } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class LabRecordController extends BaseController {

    //#region member variables and constructors

    _service: LabRecordService = Injector.Container.resolve(LabRecordService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _ehrLabService: EHRLabService = Injector.Container.resolve(EHRLabService);

    _validator: LabRecordValidator = new LabRecordValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model: LabRecordDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId, null);
            const labRecord = await this._service.create(model);
            if (labRecord == null) {
                throw new ApiError(400, 'Cannot create lab record!');
            }
            await this._ehrLabService.addEHRLabRecordForAppNames(labRecord);
            ResponseHandler.success(request, response, `${labRecord.DisplayName} record created successfully!`, 201, {
                LabRecord : labRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const labRecord = await this._service.getById(id);
            if (labRecord == null) {
                throw new ApiError(404, 'Lab record not found.');
            }
            await this.authorizeOne(request, labRecord.PatientUserId, null);
            ResponseHandler.success(request, response, `${labRecord.DisplayName} record retrieved successfully!`, 200, {
                LabRecord : labRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters: LabRecordSearchFilters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} lab records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                LabRecordRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Lab record not found.');
            }
            await this.authorizeOne(request, existingRecord.PatientUserId, null);
            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update lab record!');
            }

            await this._ehrLabService.addEHRLabRecordForAppNames(updated);

            ResponseHandler.success(request, response, `${updated.DisplayName} record updated successfully!`, 200, {
                LabRecord : updated,
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
                throw new ApiError(404, `${existingRecord.DisplayName} record not found.`);
            }
            await this.authorizeOne(request, existingRecord.PatientUserId, null);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, `${existingRecord.DisplayName} record cannot be deleted.`);
            }

            // delete ehr record
            this._ehrLabService.deleteLabEHRRecord(existingRecord.id);

            ResponseHandler.success(request, response, `${existingRecord.DisplayName} record deleted successfully!`, 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
    private authorizeSearch = async (
        request: express.Request,
        searchFilters: LabRecordSearchFilters): Promise<LabRecordSearchFilters> => {

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
