import { Logger } from "../../../../common/logger";

export class TerraCache {

    static TerraRequest: any = {};

    constructor() {
        TerraCache.TerraRequest = {};
    }

    static async GetFilteredRequest(body) {
        const key = `${body.User.ReferenceId}:${body.Type}`;
        Logger.instance().log(`Terra cache timestamp ${JSON.stringify(TerraCache.TerraRequest, null, 2)}`);

        if (key in TerraCache.TerraRequest) {
            const oldTimeStamp: any = new Date(TerraCache.TerraRequest[key]);
            const newTimeStamp: any = new Date(body.User.LastWebhookUpdate);
            const timeDiffrence = (newTimeStamp - oldTimeStamp) / 1000;
            const allowedTimeDiff: number = parseInt(process.env.TERRA_ALLOWED_TIME_DIFFERENCE_INSEC);
            await this.CacheCurrentRequest(body);
            if (timeDiffrence >  allowedTimeDiff) {
                return body;
            } else {
                return null;
            }
        } else {
            await this.CacheCurrentRequest(body);
            return body;
        }
    }

    static async CacheCurrentRequest(body) {
        const key = `${body.User.ReferenceId}:${body.Type}`;
        TerraCache.TerraRequest[key] = new Date(body.User.LastWebhookUpdate);
        Logger.instance().log(`Successfully cached terra request and key is ${key}`);
    }

}
