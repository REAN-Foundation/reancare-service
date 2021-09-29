import express from 'express';

import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { Loader } from '../../../../startup/loader';
import { Authorizer } from '../../../../auth/authorizer';
import { UserService } from '../../../../services/user.service';

import { ApiError } from '../../../../common/api.error';
import { HowDoYouFeelValidator } from '../../../validators/symptom/howDoYouFeel/howDoYouFeel.validator';
import { HowDoYouFeelService } from '../../../../services/symptom/howDoYouFeel/howDoYouFeel.service';

///////////////////////////////////////////////////////////////////////////////////////

export class HowDoYouFeelController {

    //#region member variables and constructors

    _service: HowDoYouFeelService = null;

    _userService: UserService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(HowDoYouFeelService);
        this._userService = Loader.container.resolve(UserService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HowDoYouFeel.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await HowDoYouFeelValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const howDoYouFeel = await this._service.create(domainModel);
            if (howDoYouFeel == null) {
                throw new ApiError(400, 'Cannot create howDoYouFeel!');
            }

            ResponseHandler.success(request, response, 'HowDoYouFeel created successfully!', 201, {
                HowDoYouFeel : howDoYouFeel,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HowDoYouFeel.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await HowDoYouFeelValidator.getById(request);

            const howDoYouFeel = await this._service.getById(id);
            if (howDoYouFeel == null) {
                throw new ApiError(404, 'HowDoYouFeel not found.');
            }

            ResponseHandler.success(request, response, 'HowDoYouFeel retrieved successfully!', 200, {
                HowDoYouFeel : howDoYouFeel,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HowDoYouFeel.Search';
            await this._authorizer.authorize(request, response);

            const filters = await HowDoYouFeelValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} howDoYouFeel records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { HowDoYouFeel: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HowDoYouFeel.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await HowDoYouFeelValidator.update(request);

            const id: string = await HowDoYouFeelValidator.getById(request);
            const existingHowDoYouFeel = await this._service.getById(id);
            if (existingHowDoYouFeel == null) {
                throw new ApiError(404, 'HowDoYouFeel not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update howDoYouFeel record!');
            }

            ResponseHandler.success(request, response, 'HowDoYouFeel record updated successfully!', 200, {
                HowDoYouFeel : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HowDoYouFeel.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await HowDoYouFeelValidator.getById(request);
            const existingHowDoYouFeel = await this._service.getById(id);
            if (existingHowDoYouFeel == null) {
                throw new ApiError(404, 'HowDoYouFeel not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'HowDoYouFeel cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'HowDoYouFeel record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
