import express from 'express';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { RssfeedService } from '../../../services/general/rss.feed.service';
import { Loader } from '../../../startup/loader';
import { RssfeedValidator } from './rss.feed.validator';
import { BaseController } from '../../base.controller';
import { Logger } from '../../../common/logger';
import { FileResourceService } from '../../../services/general/file.resource.service';
import fs from 'fs';

///////////////////////////////////////////////////////////////////////////////////////

export class RssfeedController extends BaseController {

    //#region member variables and constructors

    _service: RssfeedService = null;

    _fileResourceService: FileResourceService = null;

    _validator: RssfeedValidator = new RssfeedValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(RssfeedService);
        this._fileResourceService = Loader.container.resolve(FileResourceService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.Create', request, response);

            const model = await this._validator.create(request);
            const feed = await this._service.create(model);
            if (feed == null) {
                throw new ApiError(400, 'Could not create a feed!');
            }

            const updated = await this._service.createOrUpdateFeed(feed.id);

            ResponseHandler.success(request, response, 'Rssfeed created successfully!', 201, {
                Rssfeed : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const feed = await this._service.getById(id);
            if (feed == null) {
                throw new ApiError(404, 'Rssfeed not found.');
            }

            ResponseHandler.success(request, response, 'Rssfeed retrieved successfully!', 200, {
                Rssfeed : feed,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.Search', request, response);
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} rss feeds retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                RssfeedRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Rssfeed not found.');
            }

            let updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update a feed!');
            }
            updated = await this._service.createOrUpdateFeed(id);

            ResponseHandler.success(request, response, 'Rssfeed updated successfully!', 200, {
                Rssfeed : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Rssfeed record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Rssfeed can not be deleted.');
            }

            ResponseHandler.success(request, response, 'Rssfeed deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addFeedItem = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.AddFeedItem', request, response);

            const model = await this._validator.addFeedItem(request);
            const item = await this._service.addFeedItem(model);
            if (item == null) {
                throw new ApiError(400, 'Could not add a feed item!');
            }
            const updatedFeed = await this._service.createOrUpdateFeed(item?.FeedId);
            Logger.instance().log(JSON.stringify(updatedFeed));

            ResponseHandler.success(request, response, 'Rssfeed item added successfully!', 201, {
                RssfeedItem : item,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getFeedItemById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.GetFeedItemById', request, response);

            const itemId: uuid = await this._validator.getParamUuid(request, 'itemId');
            const item = await this._service.getFeedItemById(itemId);
            if (item == null) {
                throw new ApiError(404, 'Rssfeed not found.');
            }

            ResponseHandler.success(request, response, 'Rssfeed retrieved successfully!', 200, {
                RssfeedItem : item,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateFeedItem = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.UpdateFeedItem', request, response);

            const domainModel = await this._validator.updateFeedItem(request);
            const itemId: uuid = await this._validator.getParamUuid(request, 'itemId');
            const existingRecord = await this._service.getFeedItemById(itemId);
            if (existingRecord == null) {
                throw new ApiError(404, 'Rssfeed item not found.');
            }

            const updated = await this._service.updateFeedItem(itemId, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update a feed item!');
            }
            const updatedFeed = await this._service.createOrUpdateFeed(updated?.FeedId);
            Logger.instance().log(JSON.stringify(updatedFeed));

            ResponseHandler.success(request, response, 'Rssfeed updated successfully!', 200, {
                RssfeedItem : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteFeedItem = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.DeleteFeedItem', request, response);

            const itemId: uuid = await this._validator.getParamUuid(request, 'itemId');
            const existingRecord = await this._service.getFeedItemById(itemId);
            const feedId = existingRecord.FeedId;
            if (existingRecord == null) {
                throw new ApiError(404, 'Rssfeed item record not found.');
            }

            const deleted = await this._service.deleteFeedItem(itemId);
            if (!deleted) {
                throw new ApiError(400, 'Rssfeed item can not be deleted.');
            }
            const updatedFeed = await this._service.createOrUpdateFeed(feedId);
            Logger.instance().log(JSON.stringify(updatedFeed));

            ResponseHandler.success(request, response, 'Rssfeed item deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getRssFeed  = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.GetRssFeed', request, response, false);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const feed = await this._service.getById(id);
            if (feed == null) {
                throw new ApiError(404, 'Rssfeed not found.');
            }
            const mimeType = 'application/rss+xml';
            const resourceId = feed.RssFeedResourceId;
            await this.stream(resourceId, response, mimeType);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAtomFeed = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.GetAtomFeed', request, response, false);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const feed = await this._service.getById(id);
            if (feed == null) {
                throw new ApiError(404, 'Rssfeed not found.');
            }
            const mimeType = 'application/atom+xml';
            const resourceId = feed.AtomFeedResourceId;
            await this.stream(resourceId, response, mimeType);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getJsonFeed = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Rssfeed.GetJsonFeed', request, response, false);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const feed = await this._service.getById(id);
            if (feed == null) {
                throw new ApiError(404, 'Rssfeed not found.');
            }
            const mimeType = 'application/json';
            const resourceId = feed.JsonFeedResourceId;
            await this.stream(resourceId, response, mimeType);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private stream = async (resourceId: string, response: express.Response, mimeType: string) => {
        var resource = await this._fileResourceService.getById(resourceId);
        if (!resource) {
            throw new ApiError(404, 'Feed not found.');
        }
        const localDestination = await this._fileResourceService.downloadById(resourceId);
        if (localDestination == null) {
            throw new ApiError(404, 'File resource not found.');
        }
        response.setHeader('Content-type', mimeType);
        response.setHeader('Content-disposition', 'inline');
        var filestream = fs.createReadStream(localDestination);
        filestream.pipe(response);
    };

}
