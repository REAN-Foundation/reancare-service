import { IMessagingService } from '../interfaces/messaging.service.interface';
import { Logger } from '../../../common/logger';
import { Twilio } from 'twilio';

///////////////////////////////////////////////////////////////////////////////////

const account_sid = process.env.TWILIO_ACCOUNT_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN;
var serviceFromPhone = process.env.SYSTEM_PHONE_NUMBER;
// const client = new Twilio(account_sid, auth_token);

///////////////////////////////////////////////////////////////////////////////////

export class TwilioMessagingService implements IMessagingService {
    sendSMS = async (to_phone: string, message: string): Promise<boolean> => {
        try {
            return new Promise((resolve, reject) => {
                Logger.instance().log('Twilio access details not available');
                resolve(true);
            });
            // await client.messages.create({
            //     body: message,
            //     from: serviceFromPhone,
            //     to: to_phone,
            // });
            //return true;
        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

    sendWhatsappMessage = async (to_phone: string, message: string): Promise<boolean> => {
        try {
            return new Promise((resolve, reject) => {
                Logger.instance().log('Twilio access details not available');
                resolve(true);
            });
            // await client.messages.create({
            //     body: message,
            //     from: `whatsapp:${serviceFromPhone}`,
            //     to: `whatsapp:${to_phone}`,
            // });
            // return true;
        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };
}
