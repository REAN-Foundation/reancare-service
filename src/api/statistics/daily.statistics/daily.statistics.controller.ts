import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { DailyStatisticsService } from '../../../services/statistics/daily.statistics.service';
import { DailyStatisticsValidator } from './daily.statistics.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsController extends BaseController {

    //#region member variables and constructors

    _service: DailyStatisticsService = null;

    _validator = new DailyStatisticsValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(DailyStatisticsService);
    }

    //#endregion

    //#region Action methods
    
    getLatestStatistics = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyStatistics.GetLatestStatistics', request, response);
            const latestStatistics = await this._service.getLatestStatistics();
            if (latestStatistics === null) {
                throw new ApiError(404, 'Daily Statistics not found.');
            }
            ResponseHandler.success(request, response, 'Latest statistics retrieved successfully!', 200, {
                DailyStatistics : latestStatistics,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
