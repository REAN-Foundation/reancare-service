import path from 'path';
import * as defaultConfiguration from '../../reancare.config.json';
import * as localConfiguration from '../../reancare.config.local.json';
import {
    AuthenticationType,
    AuthorizationType,
    CareplanConfig,
    Configurations,
    DatabaseFlavour,
    DatabaseORM,
    DatabaseType,
    EHRProvider,
    EHRSpecification,
    EmailServiceProvider,
    FeatureFlagsProvider,
    FileStorageProvider,
    InAppNotificationServiceProvider,
    SMSServiceProvider
} from './configuration.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ConfigurationManager {

    static _config: Configurations = null;

    public static loadConfigurations = (): void => {

        const configuration = process.env.NODE_ENV === 'local' ? localConfiguration : defaultConfiguration;

        ConfigurationManager._config = {
            SystemIdentifier : configuration.SystemIdentifier,
            BaseUrl          : process.env.BASE_URL,
            Auth             : {
                Authentication : configuration.Auth.Authentication as AuthenticationType,
                Authorization  : configuration.Auth.Authorization as AuthorizationType,
            },
            Database : {
                Type    : configuration.Database.Type as DatabaseType,
                ORM     : configuration.Database.ORM as DatabaseORM,
                Flavour : configuration.Database.Flavour as DatabaseFlavour,
            },
            Ehr : {
                Enabled       : configuration.Ehr.Enabled,
                Specification : configuration.Ehr.Specification as EHRSpecification,
                Provider      : configuration.Ehr.Provider as EHRProvider,
            },
            FileStorage : {
                Provider : configuration?.FileStorage?.Provider as FileStorageProvider ?? 'Custom',
            },
            FeatureFlags : {
                Provider : configuration?.FeatureFlags?.Provider as FeatureFlagsProvider ?? 'Custom',
            },
            Communication : {
                SMSProvider               : configuration.Communication.SMS.Provider as SMSServiceProvider,
                EmailProvider             : configuration.Communication.Email.Provider as EmailServiceProvider,
                // eslint-disable-next-line max-len
                InAppNotificationProvider : configuration.Communication.InAppNotifications.Provider as InAppNotificationServiceProvider,
            },
            Careplans        : configuration.Careplans,
            TemporaryFolders : {
                Upload                     : configuration.TemporaryFolders.Upload as string,
                Download                   : configuration.TemporaryFolders.Download as string,
                CleanupFolderBeforeMinutes : configuration.TemporaryFolders.CleanupFolderBeforeMinutes as number,
            },
            FormServiceProviders : configuration.FormServiceProviders,
            MaxUploadFileSize    : configuration.MaxUploadFileSize,
            JwtExpiresIn         : configuration.JwtExpiresIn,
            SessionExpiresIn     : configuration.SessionExpiresIn,
        };

        ConfigurationManager.checkConfigSanity();
    };

    public static BaseUrl = (): string => {
        return ConfigurationManager._config.BaseUrl;
    };

    public static SystemIdentifier = (): string => {
        return ConfigurationManager._config.SystemIdentifier;
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

    public static EhrEnabled = (): boolean => {
        return ConfigurationManager._config.Ehr.Enabled;
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

    public static JwtExpiresIn = (): number => {
        return ConfigurationManager._config.JwtExpiresIn;
    }

    public static FileStorageProvider = (): FileStorageProvider => {
        return ConfigurationManager._config.FileStorage.Provider;
    };

    public static FeatureFlagsProvider = (): FeatureFlagsProvider => {
        return ConfigurationManager._config.FeatureFlags.Provider;
    };

    public static SMSServiceProvider = (): SMSServiceProvider => {
        return ConfigurationManager._config.Communication.SMSProvider;
    };

    public static EmailServiceProvider = (): EmailServiceProvider => {
        return ConfigurationManager._config.Communication.EmailProvider;
    };

    public static UploadTemporaryFolder = (): string => {
        var location = ConfigurationManager._config.TemporaryFolders.Upload;
        return path.join(process.cwd(), location);
    };

    public static DownloadTemporaryFolder = (): string => {
        var location = ConfigurationManager._config.TemporaryFolders.Download;
        return path.join(process.cwd(), location);
    };

    public static TemporaryFolderCleanupBefore = (): number => {
        return ConfigurationManager._config.TemporaryFolders.CleanupFolderBeforeMinutes;
    };

    public static InAppNotificationServiceProvider = (): InAppNotificationServiceProvider => {
        return ConfigurationManager._config.Communication.InAppNotificationProvider;
    };

    public static careplans = ()
        : { Enabled: boolean, Provider: string; Service: string; Plans: CareplanConfig[] } [] => {
        return ConfigurationManager._config.Careplans;
    };

    public static formServiceProviders = (): { Provider: string; Code: string; } [] => {
        return ConfigurationManager._config.FormServiceProviders;
    };

    public static SessionExpiresIn = (): number => {
        return ConfigurationManager._config.SessionExpiresIn;
    }

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
