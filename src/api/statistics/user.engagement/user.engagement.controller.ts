import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { UserEngagementService } from '../../../services/statistics/user.engagement.service';
import { UserEngagementValidator } from './user.engagement.validator';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserEngagementController extends BaseController {

    //#region member variables and constructors
    _service: UserEngagementService = null;

    _validator = new UserEngagementValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(UserEngagementService);
    }

    //#endregion

    //#region Action methods

    public getUserEngagementStatsByYear = async (request: express.Request, response: express.Response) => {
        try {
            await this.setContext('UserEngagement.GetUserEngagementStatsByYear', request, response);
            const stats  = await this._service.getUserEngagementStatsByYear();
            const message = 'User engagement stats retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersCountStats : stats  });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    public getUserEngagementStatsByQuarter = async (request: express.Request, response: express.Response) => {
        try {
            await this.setContext('UserEngagement.GetUserEngagementStatsByQuarter', request, response);
            const stats  = await this._service.getUserEngagementStatsByQuarter();
            const message = 'User engagement stats retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersCountStats : stats  });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    public getUserEngagementStatsByMonth = async (request: express.Request, response: express.Response) => {
        try {
            await this.setContext('UserEngagement.GetUserEngagementStatsByMonth', request, response);
            const stats  = await this._service.getUserEngagementStatsByMonth();
            const message = 'User engagement stats retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersCountStats : stats  });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    public getUserEngagementStatsByWeek = async (request: express.Request, response: express.Response) => {
        try {
            await this.setContext('UserEngagement.GetUserEngagementStatsByWeek', request, response);
            const stats  = await this._service.getUserEngagementStatsByWeek();
            const message = 'User engagement stats retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersCountStats : stats  });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    public getUserEngagementStatsByDateRange = async (request: express.Request, response: express.Response) => {
        try {
            await this.setContext('UserEngagement.GetUserEngagementStatsByDateRange', request, response);
            const filters = await this._validator.getDateRanges(request);
            const stats  = await this._service.getUserEngagementStatsByDateRange(
                filters.from as string, filters.to as string);
            const message = 'User engagement stats retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersCountStats : stats  });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    public getUserEngagementStatsForUser = async (request: express.Request, response: express.Response) => {
        try {
            await this.setContext('UserEngagement.GetUserEngagementStatsForUser', request, response);
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const stats = await this._service.getUserEngagementStatsForUser(userId);
            const message = 'User engagement stats retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersCountStats : stats  });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
