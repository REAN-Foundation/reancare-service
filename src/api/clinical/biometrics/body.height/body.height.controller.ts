import express from 'express';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { BodyHeightService } from '../../../../services/clinical/biometrics/body.height.service';
import { Injector } from '../../../../startup/injector';
import { BodyHeightValidator } from './body.height.validator';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.services/ehr.vital.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyHeightController {

    //#region member variables and constructors

    _service: BodyHeightService = Injector.Container.resolve(BodyHeightService);

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _ehrVitalService: EHRVitalService = new EHRVitalService();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await BodyHeightValidator.create(request);

            const bodyHeight = await this._service.create(model);
            if (bodyHeight == null) {
                throw new ApiError(400, 'Cannot create record for height!');
            }
            await this._ehrVitalService.addEHRBodyHeightForAppNames(bodyHeight);

            ResponseHandler.success(request, response, 'Height record created successfully!', 201, {
                BodyHeight : bodyHeight
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await BodyHeightValidator.getById(request);

            const bodyHeight = await this._service.getById(id);
            if (bodyHeight == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            ResponseHandler.success(request, response, 'Height record retrieved successfully!', 200, {
                BodyHeight : bodyHeight
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await BodyHeightValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} height records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BodyHeightRecords : searchResults
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await BodyHeightValidator.update(request);

            const id: string = await BodyHeightValidator.getById(request);
            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update height record!');
            }
            await this._ehrVitalService.addEHRBodyHeightForAppNames(updated);

            ResponseHandler.success(request, response, 'Height record updated successfully!', 200, {
                BodyHeight : updated
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await BodyHeightValidator.getById(request);
            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Height record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteVitalEHRRecord(existing.id);

            ResponseHandler.success(request, response, 'Height record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
