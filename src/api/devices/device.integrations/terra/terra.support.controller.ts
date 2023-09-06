import { Logger } from '../../../../common/logger';
import { TeraWebhookValidator } from '../../../webhooks/providers/terra/terra.webhook.validator';
import { TeraWebhookService } from '../../../../services/webhook/wearable.webhook.service';
import { Loader } from '../../../../startup/loader';
import { TeraWebhookActivityService } from '../../../../services/webhook/wearable.webhook.activity.service';
import Terra from 'terra-api';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { WearableDeviceDetailsService } from '../../../../services/webhook/wearable.device.details.service';

///////////////////////////////////////////////////////////////////////////////////////

export class TerraSupportService {

    _service: TeraWebhookService = null;

    _activityService: TeraWebhookActivityService = null;

    _wearableDeviceDetailsService: WearableDeviceDetailsService = null;

    constructor() {
        this._service = Loader.container.resolve(TeraWebhookService);
        this._activityService = Loader.container.resolve(TeraWebhookActivityService);
        this._wearableDeviceDetailsService = Loader.container.resolve(WearableDeviceDetailsService);
    }

    //#endregion

    providerName = (): string => {
        return "Terra";
    };

    public fetchDataForAllUser = async () => {
        try {
            const terra = new Terra(process.env.TERRA_DEV_ID, process.env.TERRA_API_KEY, process.env.TERRA_SIGNING_SECRET);
            const terraUsers = await this._wearableDeviceDetailsService.getAllUsers();
            const startDate = TimeHelper.subtractDuration(new Date, 1, DurationType.Day);

            for (const terraUser of terraUsers) {

                try {
                    const terraUsers = await terra.getUsers();
                    const found = terraUsers.users.some(user => user.user_id === terraUser.TerraUserId);
                    if (!found) {
                        await this._wearableDeviceDetailsService.delete(terraUser.id);
                    }

                    const bodyRequest = {
                        userId    : terraUser.TerraUserId,
                        startDate : startDate,
                        endDate   : new Date(),
                        toWebhook : false };
                    const bodyData = await terra.getBody(bodyRequest);
                    if (bodyData.status === 'success') {
                        const bodyResponse = { body: bodyData };
                        const bodyDomainModel = await TeraWebhookValidator.body(bodyResponse);
                        await this._service.body(bodyDomainModel);
                    }

                    const activityData = await terra.getActivity(bodyRequest);
                    if (activityData.status === 'success') {
                        const activityResponse = { body: activityData };
                        const activityDomainModel = await TeraWebhookValidator.activity(activityResponse);
                        await this._activityService.activity(activityDomainModel);
                    }

                    const dailyData = await terra.getDaily(bodyRequest);
                    if (dailyData.status === 'success') {
                        const dailyResponse = { body: dailyData };
                        const dailyDomainModel = await TeraWebhookValidator.daily(dailyResponse);
                        await this._service.daily(dailyDomainModel);
                    }

                    const nutritionData = await terra.getNutrition(bodyRequest);
                    if (nutritionData.status === 'success') {
                        if (nutritionData.data.length !== 0) {
                            const nutritionResponse = { body: nutritionData };
                            const nutritionDomainModel = await TeraWebhookValidator.nutrition(nutritionResponse);
                            await this._service.nutrition(nutritionDomainModel);
                        }
                    }

                    const sleepData = await terra.getSleep(bodyRequest);
                    if (sleepData.status === 'success') {
                        if (sleepData.data.length !== 0) {
                            const sleepResponse = { body: sleepData };
                            const sleepDomainModel = await TeraWebhookValidator.sleep(sleepResponse);
                            await this._activityService.sleep(sleepDomainModel);
                        }
                    }

                } catch (error) {
                    Logger.instance().error(`Some error happened for terra user id ${terraUser.TerraUserId} ${JSON.stringify(error)}`, null, null);
                    continue;
                }
            }
        } catch (error) {
            Logger.instance().error(`Unable to connect with Terra support APIs! ${JSON.stringify(error)}`, null, null);
        }
    };

    public getAllHealthAppUser = async () => {
        try {
            const terra = new Terra(process.env.TERRA_DEV_ID, process.env.TERRA_API_KEY, process.env.TERRA_SIGNING_SECRET);
            const terraUsers = await terra.getUsers();
            const filterredUsers = terraUsers.users.filter( user => user.provider !== 'APPLE');

            if (terraUsers.status === 'success') {
                for (const terraUser of filterredUsers) {
                    const authResponse = { body: terraUser };
                    const authDomainModel = await TeraWebhookValidator.auth(authResponse);
                    await this._service.auth(authDomainModel);
                }
            }

        } catch (error) {
            Logger.instance().error(`Unable to connect with Terra support APIs! ${JSON.stringify(error)}`, null, null);
        }
    };

}
