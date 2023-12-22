import * as admin from 'firebase-admin';
import { Logger } from '../../../../common/logger';
import { INotificationService } from '../notification.service.interface';
import fs from 'fs';
import { url } from 'inspector';

///////////////////////////////////////////////////////////////////////////////////

export class FirebaseNotificationService implements INotificationService {
    
    init = () => {
        try {
            const accountCreds = fs.readFileSync(process.env.FCM_GOOGLE_APPLICATION_CREDENTIALS).toString();
            const serviceAccount = JSON.parse(accountCreds);
            admin.initializeApp({
                credential : admin.credential.cert(serviceAccount),
            });
        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
        return true;
    };

    sendNotificationToDevice = async (deviceToken: string, message: any): Promise<string> => {
        try {
            message.token = deviceToken;
            if (deviceToken == null) {
                Logger.instance().log('Invalid device token!');
                return;
            }
            Logger.instance().log(`Sending notification to token: ${deviceToken}.`);
            var response = await admin.messaging().send(message);
            Logger.instance().log(`Successfully sent notification to token:  ${deviceToken}.`);
            return response;
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
            var response = await admin.messaging().sendMulticast(message);
            Logger.instance().log(`Successfully sent notification to token: ${deviceTokens}.`);
            return response;
        } catch (error) {
            var errorMessage = `Error sending notification to token: ${deviceTokens}.`;
            Logger.instance().error(errorMessage, 500, error.message);
        }
    };
    
    sendMessageToTopic = async (topic: string, message: any): Promise<string> => {
        try {
            message.topic = topic;
            Logger.instance().log(`Sending notification to topic: ${topic}.`);
            var response = await admin.messaging().send(message);
            Logger.instance().log(`Successfully sent notification to topic: ${topic}.`);
            return response;
        } catch (error) {
            var errorMessage = 'Error sending notification to topic: ' + topic;
            Logger.instance().error(errorMessage, 500, error.message);
        }
    };
    
    formatNotificationMessage = (notificationType: string, title: string, body: any, url = null): any => {
        var message = {
            data : { 
                type         : notificationType,
                title        : title,
                body         : body,
                click_action : "FLUTTER_NOTIFICATION_CLICK",
            },
            notification : {
                title : title,
                body  : body,
            },
            android : {
                ttl          : 3600 * 1000, // 1 hour in milliseconds
                priority     : 'normal',
                notification : {
                    title : title,
                    body  : body,
                    color : '#f45342',
                },
            },
            apns : {
                headers : {
                    'apns-priority' : '10',
                },
                payload : {
                    aps : {
                        alert : {
                            title : title,
                            body  : body,
                        },
                        //badge   : 2,
                        message : {
                            type  : notificationType,
                            title : title,
                            body  : body,
                        },
                    },
                },
            },
        };

        if (url) {
            message.data["url"] = url;
        }
        Logger.instance().log(`Notification Payload: ${JSON.stringify(message)}`);
        return message;
    };
    
    formatNotificationMessageWithData = (notificationType: string, title: string, body: any, customData: any): any => {
        var message = {
            data : {
                type       : notificationType,
                customData : customData,
            },
            notification : {
                title : title,
                body  : body,
            },
            android : {
                ttl          : 3600 * 1000, // 1 hour in milliseconds
                priority     : 'normal',
                notification : {
                    title : title,
                    body  : body,

                    //'customData': 'customData'
                },
            },
            apns : {
                headers : {
                    'apns-priority' : '10',
                },
                payload : {
                    aps : {
                        alert : {
                            title : title,
                            body  : body,
                        },
                        badge   : 2,
                        message : {
                            type : notificationType,

                            //'customData': 'customData'
                        },
                    },
                },
            },
        };
        return message;
    };
       
}
