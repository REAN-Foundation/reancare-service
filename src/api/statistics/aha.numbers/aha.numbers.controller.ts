import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { Logger } from '../../../common/logger';
import { AhaNumbersService } from '../../../services/statistics/aha.numbers/aha.numbers.service';
import { BaseController } from '../../../api/base.controller';
import { Injector } from '../../../startup/injector';
import { ApiError } from '../../../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class AhaNumbersController extends BaseController {

    private readonly _ahaNumbersService: AhaNumbersService;

    constructor() {
        super();
        this._ahaNumbersService = Injector.Container.resolve(AhaNumbersService);
    }

    upload = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this._ahaNumbersService.enqueueGenerateCsv();
            
            const message = 'AHA numbers CSV generation started in background!';
            ResponseHandler.success(request, response, message, 201, null);

        } catch (error) {
            Logger.instance().log(`Error uploading AHA Numbers CSV: ${error}`);
            ResponseHandler.handleError(request, response, error);
        }
    };

    download = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const result = await this._ahaNumbersService.downloadLatestDateFolder();
            
            if (!result.success) {
                throw new ApiError(404, result.message);
            }
            response.set('Content-Type', 'application/zip');
            response.set('Content-Disposition', `attachment; filename="${result.data.zipFileName}"`);
            response.set('Content-Length', result.data.fileSize.toString());
            response.set('Cache-Control', 'no-cache');

            response.send(result.data.zipBuffer);

            Logger.instance().log(`AHA Numbers CSV download completed: ${result.data.zipFileName}`);

        } catch (error) {
            Logger.instance().log(`AHA Numbers Download Error: ${error.message}`);
            ResponseHandler.handleError(request, response, error);
        }
    };

}
