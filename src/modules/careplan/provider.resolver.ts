import { ICareplanService } from "./interfaces/careplan.service.interface";
import { ConfigurationManager } from "../../config/configuration.manager";
import Dictionary from "../../common/dictionary";
import { AhaCareplanService } from "./providers/aha/aha.careplan.service";
import { ReanCareplanService } from "./providers/rean/rean.careplan.service";
import { Injector } from "../../startup/injector";

////////////////////////////////////////////////////////////////////////

export class ProviderResolver {

    public static resolve() {
        var services = new Dictionary<ICareplanService>();
        var careplans = ConfigurationManager.careplans();
        for (var cp of careplans) {
            if (cp.Provider === 'AHA' && cp.Enabled) {
                var service = Injector.Container.resolve(AhaCareplanService);
                services.add(cp.Provider, service);
            }
            else if (cp.Provider === 'REAN' && cp.Enabled) {
                var reanService = Injector.Container.resolve(ReanCareplanService);
                services.add(cp.Provider, reanService);
            }
        }
        return services;
    }

}
