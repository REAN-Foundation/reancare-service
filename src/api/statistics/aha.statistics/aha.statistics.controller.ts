import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { AhaStatisticsService } from '../../../services/statistics/aha.statistics.service';
// import { AhaStatistcsValidator } from './statistics.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class AhaStatisticsController extends BaseController {

    //#region member variables and constructors
    _service: AhaStatisticsService = null;

    // _validator = new StatistcsValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(AhaStatisticsService);
    }

    getAhaStatistics = async (request: express.Request, response: express.Response) => {
        try {
            // await this.setContext('Statistics.GetAhaStatistics', request, response);
            // const filters = await this._validator.searchFilter(request);
            const usersStats = await this._service.getAhaStatistics();
            const message = 'Aha statistics retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersStats : usersStats });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
}
