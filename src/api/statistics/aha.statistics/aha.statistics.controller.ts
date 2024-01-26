import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { AhaStatisticsService } from '../../../services/statistics/aha.stats/aha.statistics.service';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class AhaStatisticsController {

    _service: AhaStatisticsService = Injector.Container.resolve(AhaStatisticsService);

    getAhaStatistics = async (request: express.Request, response: express.Response) => {
        try {
            const usersStats = await this._service.getAhaStatistics();
            const message = 'Aha statistics retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersStats : usersStats });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
}
