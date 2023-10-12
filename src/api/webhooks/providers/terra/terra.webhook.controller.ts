import express from 'express';
import { TerraPayload } from '../../../../domain.types/webhook/webhook.event';
import { Logger } from '../../../../common/logger';
import { ResponseHandler } from '../../../../common/response.handler';
import { BaseUserController } from '../../../users/base.user.controller';
import { TeraWebhookValidator } from './terra.webhook.validator';
import { TeraWebhookService } from '../../../../services/webhook/wearable.webhook.service';
import { Loader } from '../../../../startup/loader';
import { TeraWebhookActivityService } from '../../../../services/webhook/wearable.webhook.activity.service';
import { IWebhooksService } from '../../interfaces/webhooks.service.interface';
import { TerraCache } from './terra.webhook.cache';
//import Terra from 'terra-api';

///////////////////////////////////////////////////////////////////////////////////////

export class TeraWebhookController extends BaseUserController implements IWebhooksService {

    _service: TeraWebhookService = null;

    constructor() {
        
        super();
        this._service = Loader.container.resolve(TeraWebhookService);
    }

    //#endregion

    providerName = (): string => {
        return "Terra";
    };

    receive = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const terraPayload : TerraPayload = request.body;
            Logger.instance().log(`Tera webhook information ${JSON.stringify(terraPayload)}`);
            ResponseHandler.success(request, response, 'Message received successfully!', 200 );
           
            switch (terraPayload.type) {
                // case 'athlete': {
                //     const athleteDomainModel = await TeraWebhookValidator.athlete(request);
                //     await this._service.athlete(athleteDomainModel);
                //     Logger.instance().log(`Tera user activity request ${JSON.stringify(athleteDomainModel)}`);
                // }
                // break;
                case 'activity': {
                    const activityDomainModel = await TeraWebhookValidator.activity(request);
                    const activityService = Loader.container.resolve(TeraWebhookActivityService);
                    await activityService.activity(activityDomainModel);
                    Logger.instance().log(`Tera user activity request ${JSON.stringify(activityDomainModel)}`);
                }
                    break;
                case 'body': {
                    const bodyDomainModel = await TeraWebhookValidator.body(request);
                    const filteredBody = await TerraCache.GetFilteredRequest(bodyDomainModel);
                    if (filteredBody != null) {
                        await this._service.body(filteredBody);
                        Logger.instance().log(`Tera user body request ${JSON.stringify(bodyDomainModel)}`);
                    } else {
                        Logger.instance().log(`Tera user body request got dublicate request for userId: ${bodyDomainModel.User.ReferenceId}`);
                    }
                }
                    break;
                case 'daily': {
                    const dailyDomainModel = await TeraWebhookValidator.daily(request);
                    await this._service.daily(dailyDomainModel);
                    Logger.instance().log(`Tera user daily request ${JSON.stringify(dailyDomainModel)}`);
                }
                    break;
                case 'sleep': {
                    const sleepDomainModel = await TeraWebhookValidator.sleep(request);
                    const activityService = Loader.container.resolve(TeraWebhookActivityService);
                    await activityService.sleep(sleepDomainModel);
                    Logger.instance().log(`Tera user sleep request ${JSON.stringify(sleepDomainModel)}`);
                }
                    break;
                case 'nutrition': {
                    const nutritionDomainModel = await TeraWebhookValidator.nutrition(request);
                    const filteredNutrition = await TerraCache.GetFilteredRequest(nutritionDomainModel);
                    if (filteredNutrition != null) {
                        await this._service.nutrition(nutritionDomainModel);
                        Logger.instance().log(`Tera user nutrition request ${JSON.stringify(nutritionDomainModel)}`);
                    } else {
                        Logger.instance().log(`Tera user body request got dublicate request for userId: ${nutritionDomainModel.User.ReferenceId}`);
                    }
                }
                    break;
                case 'auth': {
                    const authDomainModel = await TeraWebhookValidator.auth(request);
                    await this._service.auth(authDomainModel);
                    Logger.instance().log(`Tera user authentication request ${JSON.stringify(authDomainModel)}`);
                }
                    break;
                case 'user_reauth': {
                    const reAuthDomainModel = await TeraWebhookValidator.reAuth(request);
                    await this._service.reAuth(reAuthDomainModel);
                    Logger.instance().log(`Tera user reauthentication request ${JSON.stringify(reAuthDomainModel)}`);
                }
                    break;
                case 'connection_error':
                    // code for connection_error case
                    break;
                case 'request_processing':
                    // code for request_processing case
                    break;
                case 'google_no_datasource':
                    // code for google_no_datasource case
                    break;
                case 'request_completed':
                    // code for request_completed case
                    break;
                case 'access_revoked':
                    // code for access_revoked case
                    break;
                case 'deauth': {
                    const deAuthDomainModel = await TeraWebhookValidator.deAuth(request);
                    await this._service.deAuth(deAuthDomainModel);
                    Logger.instance().log(`Tera user reauthentication request ${JSON.stringify(deAuthDomainModel)}`);
                }
                    break;
                case 'internal_server_error':
                    // code for internal_server_error case
                    break;
                case 'unknown':
                    // code for unknown case
                    break;
                default:
                    Logger.instance().log(`Tera method ${terraPayload.type} not implemented. Terra payload information has: ${JSON.stringify(terraPayload)}`);
            }
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    // eslint-disable-next-line max-len
    // const terra = new Terra("rean-healthguru-dev-8sCumnMOFl", "18c5ebffb6c38dba56e7201575c5039785f0e3a8ff61fb83515a629301be6f48", "4e3318165d941b16f00dc665ccfaf484008356df02e51236");

    // terra.getUsers().then((r) => Logger.instance().log(`${JSON.stringify(r.users)}`));

    //const sleepData = await terra.getSleep( { userId    : "52a21fd8-fef2-47e7-a9d7-be27b92c917a",
    //     startDate : new Date,
    //     endDate   : new Date,
    //     toWebhook : true });
    //Logger.instance().log(`Tera webhook whole request information ${JSON.stringify(sleepData)}`);
    //Logger.instance().log(`Tera webhook whole request information ${JSON.stringify(request)}`);

}
