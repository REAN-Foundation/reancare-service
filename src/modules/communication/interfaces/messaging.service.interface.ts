
export interface IMessagingService {
    sendSMS(to_phone: string, message: string): Promise<boolean>;
}
