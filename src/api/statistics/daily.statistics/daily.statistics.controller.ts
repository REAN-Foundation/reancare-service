import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { DailyStatisticsService } from '../../../services/statistics/daily.statistics.service';
import { DailyStatisticsValidator } from './daily.statistics.validator';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsController {

    //#region member variables and constructors

    _service: DailyStatisticsService = Injector.Container.resolve(DailyStatisticsService);

    _validator = new DailyStatisticsValidator();

    //#endregion

    //#region Action methods
    
    getLatestStatistics = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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
