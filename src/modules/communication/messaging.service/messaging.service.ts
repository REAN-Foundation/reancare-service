import { inject, injectable } from "tsyringe";
import { IMessagingService } from "./messaging.service.interface";

////////////////////////////////////////////////////////////////////////

@injectable()
export class MessagingService {

    constructor(@inject('IMessagingService') private _service: IMessagingService) {}

    init = (): boolean => {
        return this._service.init();
    };

    sendSMS = async (toPhone: string, message: string): Promise<boolean> => {
        return await this._service.sendSMS(toPhone, message);
    };
    
}
