import * as configuration from './rc.config.json';
import { Configurations, EHRProvider, EHRSpecification } from './configs';

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ConfigurationManager {

    static _config: Configurations = null;

    public static loadConfigurations = (): void => {

        ConfigurationManager._config = {
            Ehr : {
                Specification : configuration.Ehr.Specification as EHRSpecification,
                Provider      : configuration.Ehr.Provider as EHRProvider
            },
            MaxUploadFileSize : configuration.MaxUploadFileSize
        };
    };

    public static EhrSpecification = (): EHRSpecification => {
        return ConfigurationManager._config.Ehr.Specification;
    };

    public static EhrProvider = (): EHRProvider => {
        return ConfigurationManager._config.Ehr.Provider;
    };

    public static MaxUploadFileSize = (): number => {
        return ConfigurationManager._config.MaxUploadFileSize;
    };
 
}
