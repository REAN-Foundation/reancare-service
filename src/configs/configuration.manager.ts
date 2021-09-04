import * as configuration from '../../reancare.config.json';
import {
    Configurations,
    DatabaseType,
    DatabaseORM,
    DatabaseFlavour,
    EHRProvider,
    EHRSpecification,
    AuthenticationType,
    AuthorizationType,
} from './configs';

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ConfigurationManager {

    static _config: Configurations = null;

    public static loadConfigurations = (): void => {

        ConfigurationManager._config = {
            Auth : {
                Authentication : configuration.Auth.Authentication as AuthenticationType,
                Authorization  : configuration.Auth.Authorization as AuthorizationType,
            },
            Database : {
                Type    : configuration.Database.Type as DatabaseType,
                ORM     : configuration.Database.ORM as DatabaseORM,
                Flavour : configuration.Database.Flavour as DatabaseFlavour,
            },
            Ehr : {
                Specification : configuration.Ehr.Specification as EHRSpecification,
                Provider      : configuration.Ehr.Provider as EHRProvider,
            },
            MaxUploadFileSize : configuration.MaxUploadFileSize,
        };

        ConfigurationManager.checkConfigSanity();
    };

    public static Authentication = (): AuthenticationType => {
        return ConfigurationManager._config.Auth.Authentication;
    };

    public static Authorization = (): AuthorizationType => {
        return ConfigurationManager._config.Auth.Authorization;
    };

    public static DatabaseType = (): DatabaseType => {
        return ConfigurationManager._config.Database.Type;
    };

    public static DatabaseORM = (): DatabaseORM => {
        return ConfigurationManager._config.Database.ORM;
    };

    public static DatabaseFlavour = (): DatabaseFlavour => {
        return ConfigurationManager._config.Database.Flavour;
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

    private static checkConfigSanity() {

        //Check database configurations

        if (ConfigurationManager._config.Database.Type === 'SQL') {
            var orm = ConfigurationManager._config.Database.ORM;
            var flavour = ConfigurationManager._config.Database.Flavour;
            if (orm !== 'Sequelize' && orm !== 'Knex') {
                throw new Error('Database configuration error! - Unspported/non-matching ORM');
            }
            if (flavour !== 'MySQL' && flavour !== 'PostGreSQL') {
                throw new Error('Database configuration error! - Unspported/non-matching databse flavour');
            }
        }
        if (ConfigurationManager._config.Database.Type === 'NoSQL') {
            var orm = ConfigurationManager._config.Database.ORM;
            var flavour = ConfigurationManager._config.Database.Flavour;
            if (flavour === 'MongoDB') {
                if (orm !== 'Mongoose') {
                    throw new Error('Database configuration error! - Unspported/non-matching ORM');
                }
            }
        }
    }

}
