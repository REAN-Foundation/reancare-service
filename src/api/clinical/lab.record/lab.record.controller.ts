import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { UserService } from '../../../services/users/user/user.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { LabRecordService } from '../../../services/clinical/lab.record/lab.record.service';
import { LabRecordValidator } from './lab.record.validator';
import { EHRAnalyticsHandler } from '../../../custom/ehr.analytics/ehr.analytics.handler';
import { LabRecordDomainModel } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.domain.model';
import { EHRRecordTypes } from '../../../custom/ehr.analytics/ehr.record.types';

///////////////////////////////////////////////////////////////////////////////////////

export class LabRecordController extends BaseController {

    //#region member variables and constructors
    _service: LabRecordService = null;

    _userService: UserService = null;

    _validator: LabRecordValidator = new LabRecordValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(LabRecordService);
        this._userService = Loader.container.resolve(UserService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecord.Create', request, response);

            const model = await this._validator.create(request);
            const labRecord = await this._service.create(model);
            if (labRecord == null) {
                throw new ApiError(400, 'Cannot create lab record!');
            }
            this.addEHRRecord(model.PatientUserId, labRecord.id, model);
            ResponseHandler.success(request, response, `${labRecord.DisplayName} record created successfully!`, 201, {
                LabRecord : labRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('LabRecord.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const labRecord = await this._service.getById(id);
            if (labRecord == null) {
                throw new ApiError(404, 'Lab record not found.');
            }
            ResponseHandler.success(request, response, `${labRecord.DisplayName} record retrieved successfully!`, 200, {
                LabRecord : labRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecord.Search', request, response);

            const filters = await this._validator.search(request);
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

            await this.setContext('LabRecord.Update', request, response);

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Lab record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update lab record!');
            }
            this.addEHRRecord(model.PatientUserId, model.id, model);
            ResponseHandler.success(request, response, `${updated.DisplayName} record updated successfully!`, 200, {
                LabRecord : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecord.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, `${existingRecord.DisplayName} record not found.`);
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, `${existingRecord.DisplayName} record cannot be deleted.`);
            }

            ResponseHandler.success(request, response, `${existingRecord.DisplayName} record deleted successfully!`, 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addEHRRecord = (patientUserId: uuid, recordId: uuid, model: LabRecordDomainModel) => {
        if (model) {
            EHRAnalyticsHandler.addIntegerRecord(
                patientUserId,
                recordId,
                EHRRecordTypes.LabRecord, model.PrimaryValue, model.Unit, model.TypeName, model.DisplayName);
        }
    };

    //#endregion

}
