import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { UserService } from '../../../services/users/user/user.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { LabRecordService } from '../../../services/clinical/lab.record/lab.record.service';
import { LabRecordValidator } from './lab.record.validator';
import { Injector } from '../../../startup/injector';
import { EHRLabService } from '../../../modules/ehr.analytics/ehr.services/ehr.lab.service';

///////////////////////////////////////////////////////////////////////////////////////

export class LabRecordController {

    //#region member variables and constructors

    _service: LabRecordService = Injector.Container.resolve(LabRecordService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _ehrLabService: EHRLabService = Injector.Container.resolve(EHRLabService);

    _validator: LabRecordValidator = new LabRecordValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
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
            ResponseHandler.success(request, response, `${labRecord.DisplayName} record retrieved successfully!`, 200, {
                LabRecord : labRecord,
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
    
}
