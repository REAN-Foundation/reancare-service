import { IMessagingService } from '../interfaces/messaging.service.interface';
import { Logger } from '../../../common/logger';
import { Twilio } from 'twilio';

///////////////////////////////////////////////////////////////////////////////////

const account_sid = process.env.TWILIO_ACCOUNT_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN;
const serviceFromPhone = process.env.SYSTEM_PHONE_NUMBER;
const client = new Twilio(account_sid, auth_token);

///////////////////////////////////////////////////////////////////////////////////

export class TwilioMessagingService implements IMessagingService {

    sendSMS = async (toPhone: string, message: string): Promise<boolean> => {
        try {
            Logger.instance().log(`To phone: '${toPhone}', Message: '${message}'`);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars

            var from_phone_tmp = process.env.SYSTEM_INTERNATIONAL_PHONE_NUMBER;

            //If we are sending to US, use the US phone number to send
            var to_phone_tmp = toPhone.trim();
            if (to_phone_tmp.startsWith('+1')) {
                from_phone_tmp = process.env.SYSTEM_US_PHONE_NUMBER;
            }

            const smsResponse = await client.messages.create({
                body : message,
                from : from_phone_tmp,
                to   : to_phone_tmp,
            });

            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

    sendWhatsappMessage = async (toPhone: string, message: string): Promise<boolean> => {
        try {
            Logger.instance().log(`To phone: '${toPhone}', Message: '${message}'`);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return new Promise((resolve, reject) => {
                Logger.instance().log('Twilio access details not available');
                resolve(true);
            });

            await client.messages.create({
                body : message,
                from : `whatsapp:${serviceFromPhone}`,
                to   : `whatsapp:${toPhone}`,
            });
            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

}
