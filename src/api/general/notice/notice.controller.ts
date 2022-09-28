import express from 'express';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { NoticeService } from '../../../services/general/notice.service';
import { Loader } from '../../../startup/loader';
import { NoticeValidator } from './notice.validator';
import { BaseController } from '../../base.controller';
import { NoticeActionDomainModel } from '../../../domain.types/general/notice.action/notice.action.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class NoticeController extends BaseController {

    //#region member variables and constructors

    _service: NoticeService = null;

    _validator: NoticeValidator = new NoticeValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(NoticeService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('General.Notice.Create', request, response);

            const model = await this._validator.create(request);
            const notice = await this._service.create(model);
            if (notice == null) {
                throw new ApiError(400, 'Could not create a notice!');
            }

            ResponseHandler.success(request, response, 'Notice created successfully!', 201, {
                Notice : notice,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('General.Notice.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const notice = await this._service.getById(id);
            if (notice == null) {
                throw new ApiError(404, 'Notice not found.');
            }

            ResponseHandler.success(request, response, 'Notice retrieved successfully!', 200, {
                Notice : notice,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('General.Notice.Search', request, response);
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} notices retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                NoticeRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('General.Notice.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Notice not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update a notice!');
            }

            ResponseHandler.success(request, response, 'Notice updated successfully!', 200, {
                Notice : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('General.Notice.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Notice record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Notice can not be deleted.');
            }

            ResponseHandler.success(request, response, 'Notice deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createAction = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('General.Notice.CreateAction', request, response);

            const userId = request.currentUser.UserId;
            const model = await this._validator.createAction(request);
            const entity: NoticeActionDomainModel = {
                UserId        : userId,
                NoticeId      : model.NoticeId,
                Action        : model.Action,
                ActionContent : model.ActionContent,
                ActionTakenAt : model.ActionTakenAt
            };

            const noticeAction = await this._service.createAction(entity);
            if (noticeAction == null) {
                throw new ApiError(400, 'Could not perform notice action!');
            }

            ResponseHandler.success(request, response, 'Notice action performed successfully!', 201, {
                NoticeAction : noticeAction,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getActionById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('General.Notice.GetActionById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const noticeAction = await this._service.getActionById(id);
            if (noticeAction == null) {
                throw new ApiError(404, 'Notice action not found.');
            }

            ResponseHandler.success(request, response, 'Notice action retrieved successfully!', 200, {
                NoticeAction : noticeAction,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
