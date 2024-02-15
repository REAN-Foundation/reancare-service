
export interface INotificationService {

    init(): boolean;
    
    sendNotificationToDevice(deviceToken: string, message: any): Promise<string>;

    sendNotificationToMultipleDevice(deviceToken: string[], message: any): Promise<any>;

    sendMessageToTopic(topic: string, message: any): Promise<string>;

    formatNotificationMessage(notificationType: string, title: string, body: any, url?: string): any;
    
    formatNotificationMessageWithData(notificationType: string, title: string, body: any, customData: any): any;
}
