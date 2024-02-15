import { inject, injectable } from "tsyringe";
import { INotificationService } from "./notification.service.interface";

////////////////////////////////////////////////////////////////////////

@injectable()
export class NotificationService {

    constructor(@inject('INotificationService') private _service: INotificationService) {}

    init = (): boolean => {
        return this._service.init();
    };

    sendNotificationToDevice = async (deviceToken: string, message: any): Promise<string> => {
        return await this._service.sendNotificationToDevice(deviceToken, message);
    };

    sendNotificationToMultipleDevice = async (deviceTokens: string[], message: any): Promise<any> => {
        return await this._service.sendNotificationToMultipleDevice(deviceTokens, message);
    };

    sendMessageToTopic = async (topic: string, message: any): Promise<string> => {
        return await this._service.sendMessageToTopic(topic, message);
    };

    formatNotificationMessage = (notificationType: string, title: string, body: any, url?: string): any => {
        return this._service.formatNotificationMessage(notificationType, title, body, url);
    };
    
    formatNotificationMessageWithData = (notificationType: string, title: string, body: any, customData: any): any => {
        return this._service.formatNotificationMessageWithData(notificationType, title, body, customData);
    };

}
