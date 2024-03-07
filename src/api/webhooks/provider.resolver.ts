import { ConfigurationManager } from "../../config/configuration.manager";
import { Injector } from "../../startup/injector";
import Dictionary from "../../common/dictionary";
import { IWebhooksService } from "./interfaces/webhooks.service.interface";
import { TeraWebhookController } from "./providers/terra/terra.webhook.controller";

////////////////////////////////////////////////////////////////////////

export class ProviderResolver {

    public static resolve() {

        var services = new Dictionary<IWebhooksService>();
        var providers = ConfigurationManager.webhookControllerProviders();

        for (var cp of providers) {
            if (cp.Provider === 'Terra') {
                services.add(cp.Provider, Injector.Container.resolve(TeraWebhookController));
            }
        }
        return services;
    }

}
