import * as asyncLib from 'async';
import { Logger } from '../../common/logger';
import { Injector } from '../../startup/injector';
import { PatientService } from '../../services/users/patient/patient.service';
import { MessagingService } from '../../modules/communication/messaging.service/messaging.service';
import { SupportedLanguage } from '../../domain.types/users/user/user.types';
import { loadLanguageTemplates } from '../../modules/communication/message.template/language/language.selector';
import { TimeHelper } from '../../common/time.helper';

///////////////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT  = 4;
const SMS_DELAY_MS      = 1000;

export class SunsetSmsQueue {

    private static _q = asyncLib.queue((patientUserId: string, done) => {
        (async () => {
            await SunsetSmsQueue.processJob(patientUserId);
            await TimeHelper.timeDelay(SMS_DELAY_MS);
            done();
        })();
    }, ASYNC_TASK_COUNT);

    public static pushAll = (patientUserIds: string[]): void => {
        patientUserIds.forEach(patientUserId => {
            SunsetSmsQueue._q.push(patientUserId, (err) => {
                if (err) {
                    Logger.instance().log(`[SunsetSmsQueue] Error processing patient ${patientUserId}: ${err.message}`);
                }
            });
        });
        Logger.instance().log(`[SunsetSmsQueue] Pushed ${patientUserIds.length} patients to in-memory queue.`);
    };

    private static processJob = async (patientUserId: string): Promise<void> => {
        try {
            const patientService   = Injector.Container.resolve(PatientService);
            const messagingService = Injector.Container.resolve(MessagingService);

            const patient     = await patientService.getByUserId(patientUserId);
            const phoneNumber = patient?.User?.Person?.Phone;
            const message     = loadLanguageTemplates(SupportedLanguage.English)['SunsetTextMessage'].Message;

            const sendStatus = await messagingService.sendSMS(phoneNumber, message);
            if (sendStatus) {
                Logger.instance().log(`[SunsetSmsQueue] SMS sent successfully to ${patientUserId}`);
            } else {
                Logger.instance().log(`[SunsetSmsQueue] Failed to send SMS for ${phoneNumber}`);
            }
        } catch (error) {
            Logger.instance().log(`[SunsetSmsQueue] Error processing patient ${patientUserId}: ${error.message}`);
        }
    };

}
