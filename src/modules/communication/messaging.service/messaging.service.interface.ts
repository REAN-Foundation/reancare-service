
export interface IMessagingService {

    init(): boolean;
    
    sendSMS(to_phone: string, message: string): Promise<boolean>;

    sendWhatsappMessage(to_phone: string, message: string): Promise<boolean>;
}
