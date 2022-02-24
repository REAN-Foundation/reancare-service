import { IFormsService } from "./interfaces/forms.service.interface";
import { ConfigurationManager } from "../../config/configuration.manager";
import { Loader } from "../../startup/loader";
import Dictionary from "../../common/dictionary";
import { KoboToolboxService } from "./providers/kobo.toolbox/kobo.toolbox.service";

////////////////////////////////////////////////////////////////////////

export class ProviderResolver {

    public static resolve() {
        var services = new Dictionary<IFormsService>();
        var careplans = ConfigurationManager.careplans();
        for (var cp of careplans) {
            if (cp.Provider === 'AHA') {
                var service = Loader.container.resolve(KoboToolboxService);
                services.add(cp.Provider, service);
            }
        }
        return services;
    }

}
