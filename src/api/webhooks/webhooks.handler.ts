import express from "express";
import Dictionary from "../../common/dictionary";
import { IWebhooksService } from "./interfaces/webhooks.service.interface";
import { ProviderResolver } from "./provider.resolver";

////////////////////////////////////////////////////////////////////////

export class WebhooksHandler {

    static _services: Dictionary<IWebhooksService> = new Dictionary<IWebhooksService>();

    public static receive = async (request: express.Request, response: express.Response): Promise<void> => {
        var service = WebhooksHandler.getService('Terra');
        return await service.receive(request, response);
    };

    private static getService(providerName) {
        const provider = providerName;
        WebhooksHandler._services = ProviderResolver.resolve();
        return WebhooksHandler._services.getItem(provider);
    }

}
