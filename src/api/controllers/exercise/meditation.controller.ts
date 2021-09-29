import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { ApiError } from '../../../common/api.error';
import { MeditationService } from '../../../services/exercise/meditation.service';
import { Authorizer } from '../../../auth/authorizer';
import { MeditationValidator } from '../../validators/exercise/meditation.validator';
import { Helper } from '../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class MeditationController {

    //#region member variables and constructors

    _service: MeditationService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(MeditationService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Exercise.Meditation.Create';

            const meditationDomainModel = await MeditationValidator.create(request);

            const Meditation = await this._service.create(meditationDomainModel);
            if (Meditation == null) {
                throw new ApiError(400, 'Cannot create record for meditation!');
            }

            ResponseHandler.success(request, response, 'Meditation record created successfully!', 201, {
                Meditation : Meditation,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Exercise.Meditation.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await MeditationValidator.getById(request);

            const Meditation = await this._service.getById(id);
            if (Meditation == null) {
                throw new ApiError(404, ' Meditation record not found.');
            }

            ResponseHandler.success(request, response, 'Meditation record retrieved successfully!', 200, {
                Meditation : Meditation,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Exercise.Meditation.Search';
            await this._authorizer.authorize(request, response);

            const filters = await MeditationValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} meditation records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                MeditationRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Exercise.Meditation.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await MeditationValidator.update(request);

            const id: string = await MeditationValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Meditation record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update meditation record!');
            }

            ResponseHandler.success(request, response, 'Meditation record updated successfully!', 200, {
                Meditation : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Exercise.Meditation.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await MeditationValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Meditation record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Meditation record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Meditation record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
