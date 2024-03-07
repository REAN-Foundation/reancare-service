import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { DailyStatisticsService } from '../../../services/statistics/daily.statistics.service';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsController {

    //#region member variables and constructors

    _service: DailyStatisticsService = Injector.Container.resolve(DailyStatisticsService);

    //#endregion

    //#region Action methods
    
    getDailySystemStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const stats = await this._service.getDailySystemStats();
            if (stats === null) {
                throw new ApiError(404, 'Daily Statistics not found.');
            }
            ResponseHandler.success(request, response, 'Daily stats retrieved successfully!', 200, {
                DailyStatistics : stats,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getDailyTenantStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId = request.params.tenantId;
            const stats = await this._service.getDailyTenantStats(tenantId);
            if (stats === null) {
                throw new ApiError(404, 'Daily Statistics not found.');
            }
            ResponseHandler.success(request, response, 'Daily stats retrieved successfully!', 200, {
                DailyStatistics : stats,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
