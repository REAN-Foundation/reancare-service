import { Logger } from '../../../../common/logger';
import { INotificationService } from '../notification.service.interface';

///////////////////////////////////////////////////////////////////////////////////

export class MockNotificationService implements INotificationService {
    
    init = () => {
        return true;
    };

    sendNotificationToDevice = async (deviceToken: string, message: any): Promise<string> => {
        try {
            message.token = deviceToken;
            if (deviceToken == null) {
                Logger.instance().log('Invalid device token!');
                return `Invalid device token`;
            }
            Logger.instance().log(`Successfully sent notification to token:  ${deviceToken}.`);
            return `Sent notification successfully`;
        } catch (error) {
            var errorMessage = `Error sending notification to token: ${deviceToken}.`;
            Logger.instance().error(errorMessage, 500, error.message);
        }
    };
    
    sendNotificationToMultipleDevice = async (
        deviceTokens: string[],
        message: any): Promise<any> => {
        try {
            message.tokens = deviceTokens;
            Logger.instance().log(`Sending notification to tokens: ${deviceTokens}.`);
            Logger.instance().log(`Successfully sent notification to token: ${deviceTokens}.`);
            return `Sent notfication to multiple devices`;
        } catch (error) {
            var errorMessage = `Error sending notification to token: ${deviceTokens}.`;
            Logger.instance().error(errorMessage, 500, error.message);
        }
    };
    
    sendMessageToTopic = async (topic: string, message: any): Promise<string> => {
        try {
            message.topic = topic;
            Logger.instance().log(`Sending notification to topic: ${topic}.`);
            Logger.instance().log(`Successfully sent notification to topic: ${topic}.`);
            return `Sent notification to topic successfully`;
        } catch (error) {
            var errorMessage = 'Error sending notification to topic: ' + topic;
            Logger.instance().error(errorMessage, 500, error.message);
        }
    };
    
    formatNotificationMessage = (notificationType: string, title: string, body: any): any => {
        return {
            type  : notificationType,
            title : title,
            body  : body
        };
    };
    
    formatNotificationMessageWithData = (notificationType: string, title: string, body: any, customData: any): any => {
        return {
            type  : notificationType,
            title : title,
            body  : body,
            data  : customData
        };
    };
       
}
