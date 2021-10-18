import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { MoveMinutesService } from '../../../../services/wellness/daily.records/move.minutes.service';
import { Loader } from '../../../../startup/loader';
import { MoveMinutesValidator } from '../../../validators/wellness/daily.records/move.minutes.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class MoveMinutesController {

    //#region member variables and constructors

    _service: MoveMinutesService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(MoveMinutesService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.MoveMinutes.Create';

            const moveMinutesDomainModel = await MoveMinutesValidator.create(request);

            const MoveMinutes = await this._service.create(moveMinutesDomainModel);
            if (MoveMinutes == null) {
                throw new ApiError(400, 'Cannot create record for daily move minutes!');
            }

            ResponseHandler.success(request, response, 'Daily move minutes record created successfully!', 201, {
                MoveMinutes : MoveMinutes,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.MoveMinutes.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await MoveMinutesValidator.getById(request);

            const MoveMinutes = await this._service.getById(id);
            if (MoveMinutes == null) {
                throw new ApiError(404, 'Daily move minutes record not found.');
            }

            ResponseHandler.success(request, response, 'Daily move minutes record retrieved successfully!', 200, {
                MoveMinutes : MoveMinutes,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.MoveMinutes.Search';
            await this._authorizer.authorize(request, response);

            const filters = await MoveMinutesValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Daily move minutes records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                MoveMinutesRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.MoveMinutes.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await MoveMinutesValidator.update(request);

            const id: string = await MoveMinutesValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Daily move minutes record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Daily move minutes record!');
            }

            ResponseHandler.success(request, response, 'Daily move minutes record updated successfully!', 200, {
                MoveMinutes : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.MoveMinutes.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await MoveMinutesValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Daily move minutes record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Daily move minutes record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Daily move minutes record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
