import { Logger } from '../../../../common/logger';
import { IMessagingService } from '../messaging.service.interface';

///////////////////////////////////////////////////////////////////////////////////

export class MockMessagingService implements IMessagingService {

    init(): boolean {
        Logger.instance().log(`Initialized mock messaging service!`);
        return true;
    }

    sendSMS = async (toPhone: string, message: string): Promise<boolean> => {
        try {
            Logger.instance().log(`To phone: '${toPhone}', Message: '${message}'`);
            return Promise.resolve(true);
        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

    sendWhatsappMessage = async (toPhone: string, message: string): Promise<boolean> => {
        try {
            Logger.instance().log(`To phone: '${toPhone}', Message: '${message}'`);
            return Promise.resolve(true);
        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

}
