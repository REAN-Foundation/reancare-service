import { ICareplanService } from "./interfaces/careplan.service.interface";
import { ConfigurationManager } from "../../config/configuration.manager";
import { Loader } from "../../startup/loader";
import Dictionary from "../../common/dictionary";
import { AhaCareplanService } from "./providers/aha/aha.careplan.service";
import { ReanCareplanService } from "./providers/rean/rean.careplan.service";

////////////////////////////////////////////////////////////////////////

export class ProviderResolver {

    public static resolve() {
        var services = new Dictionary<ICareplanService>();
        var careplans = ConfigurationManager.careplans();
        for (var cp of careplans) {
            if (cp.Provider === 'AHA' && cp.Enabled) {
                var service = Loader.container.resolve(AhaCareplanService);
                services.add(cp.Provider, service);
            }
            else if (cp.Provider === 'REAN' && cp.Enabled) {
                var reanService = Loader.container.resolve(ReanCareplanService);
                services.add(cp.Provider, reanService);
            }
        }
        return services;
    }

}
