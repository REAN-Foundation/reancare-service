import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { HowDoYouFeelService } from '../../../../services/clinical/symptom/how.do.you.feel.service';
import { Injector } from '../../../../startup/injector';
import { HowDoYouFeelValidator } from './how.do.you.feel.validator';
import { EHRHowDoYouFeelService } from '../../../../modules/ehr.analytics/ehr.services/ehr.how.do.you.feel.service';

///////////////////////////////////////////////////////////////////////////////////////

export class HowDoYouFeelController {

    //#region member variables and constructors

    _service: HowDoYouFeelService = Injector.Container.resolve(HowDoYouFeelService);

    _validator: HowDoYouFeelValidator = new HowDoYouFeelValidator();

    _ehrHowDoYouFeelService: EHRHowDoYouFeelService = Injector.Container.resolve(EHRHowDoYouFeelService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
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

            ResponseHandler.success(request, response, 'How do you feel record retrieved successfully!', 200, {
                HowDoYouFeel : howDoYouFeel,
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

}
