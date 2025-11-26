import { Logger } from "../../../common/logger";
import { BiometricAlertModel, BiometricAlertSettings } from "../../../domain.types/clinical/biometrics/biometrics.types";
import * as asyncLib from 'async';

///////////////////////////////////////////////////////////////////////////////

export class AlertQueue {

    private static _numAsyncTasks = 4;

    private static _notificationQueue = asyncLib.queue((task: { model:BiometricAlertModel,
        handlerFunction: (model: BiometricAlertModel, metaData: BiometricAlertSettings | null) => Promise<void> }, done) => {
        (async () => {
            await task.handlerFunction(task.model, task.model.BiometricAlertSettings);
            done();
        })();
    }, this._numAsyncTasks);

    static async pushNotification(model: BiometricAlertModel, handlerFunction: (model: BiometricAlertModel,
        metaData: BiometricAlertSettings | null) => Promise<void>) {
        await this._notificationQueue.push({ model, handlerFunction }, (err: any) => {
            if (err) {
                Logger.instance().log(`Error pushing ${model.BiometricAlertSettings?.Type} alert: ${err.message}`);
            }
        });
    }

}

