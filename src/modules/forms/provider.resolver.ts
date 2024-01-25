import { IFormsService } from "./interfaces/forms.service.interface";
import { ConfigurationManager } from "../../config/configuration.manager";
import Dictionary from "../../common/dictionary";
import { KoboToolboxService } from "./providers/kobo.toolbox/kobo.toolbox.service";
import { Injector } from "../../startup/injector";

////////////////////////////////////////////////////////////////////////

export class ProviderResolver {

    public static resolve() {

        var services = new Dictionary<IFormsService>();
        var providers = ConfigurationManager.formServiceProviders();

        for (var cp of providers) {
            if (cp.Provider === 'KoboToolbox') {
                services.add(cp.Provider, Injector.Container.resolve(KoboToolboxService));
            }
            // else if (cp.Provider === 'GoogleForms') {
            //     services.add(cp.Provider, Injector.Container.resolve(GoogleFormsService));
            // }
        }
        return services;
    }

}
