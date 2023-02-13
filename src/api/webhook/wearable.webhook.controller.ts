import express from 'express';
import { Logger } from '../../common/logger';
import { ResponseHandler } from '../../common/response.handler';
import { BaseUserController } from '../users/base.user.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class TeraWebhookController extends BaseUserController {

    constructor() {
        super();
    }

    //#endregion

    receive = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            //Logger.instance().log(`Tera webhook whole request information ${JSON.stringify(request)}`);
            const body = request.body;
            Logger.instance().log(`Tera webhook information ${JSON.stringify(body)}`);
            ResponseHandler.success(request, response, 'Message received successfully!', 200, {
                RequestBody : body,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
