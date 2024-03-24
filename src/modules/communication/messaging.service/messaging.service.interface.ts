
export interface IMessagingService {

    init(): boolean;

    sendSMS(toPhone: string, message: string): Promise<boolean>;

    sendWhatsappMessage(toPhone: string, message: string): Promise<boolean>;
}
