import path from 'path';
import * as defaultConfiguration from '../../reancare.config.json';
import * as localConfiguration from '../../reancare.config.local.json';
import {
    AuthenticationType,
    AuthorizationType,
    CareplanConfig,
    Configurations,
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

        const configuration = process.env.NODE_ENV === 'local'
            || process.env.NODE_ENV === 'test'
            ? localConfiguration : defaultConfiguration;

        ConfigurationManager._config = {
            SystemIdentifier : configuration.SystemIdentifier,
            BaseUrl          : process.env.BASE_URL,
            Auth             : {
                Authentication               : configuration.Auth.Authentication as AuthenticationType,
                Authorization                : configuration.Auth.Authorization as AuthorizationType,
                UseRefreshToken              : configuration.Auth.UseRefreshToken,
                AccessTokenExpiresInSeconds  : configuration.Auth.AccessTokenExpiresInSeconds,
                RefreshTokenExpiresInSeconds : configuration.Auth.RefreshTokenExpiresInSeconds
            },
            Database : {
                Type : configuration.Database.Type as DatabaseType,
                ORM  : configuration.Database.ORM as DatabaseORM,
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
            FormServiceProviders       : configuration.FormServiceProviders,
            WebhookControllerProviders : configuration.WebhookControllerProviders,
            MaxUploadFileSize          : configuration.MaxUploadFileSize,
            EHRAnalytics               : configuration.EHRAnalytics,
            Gamification               : configuration.Gamification,
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

    public static UseRefreshToken = (): boolean => {
        return ConfigurationManager._config.Auth.UseRefreshToken;
    };

    public static AccessTokenExpiresInSeconds = (): number => {
        return ConfigurationManager._config.Auth.AccessTokenExpiresInSeconds;
    };

    public static RefreshTokenExpiresInSeconds = (): number => {
        return ConfigurationManager._config.Auth.RefreshTokenExpiresInSeconds;
    };

    public static DatabaseType = (): DatabaseType => {
        return ConfigurationManager._config.Database.Type;
    };

    public static DatabaseORM = (): DatabaseORM => {
        return ConfigurationManager._config.Database.ORM;
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

    public static webhookControllerProviders = (): { Provider: string; Code: string; } [] => {
        return ConfigurationManager._config.WebhookControllerProviders;
    };

    public static EHRAnalyticsEnabled = (): boolean => {
        return ConfigurationManager._config?.EHRAnalytics;
    };

    public static GamificationEnabled = (): boolean => {
        return ConfigurationManager._config?.Gamification;
    };

    private static checkConfigSanity() {

        //Check database configurations

        if (ConfigurationManager._config.Database.Type === 'SQL') {
            var orm = ConfigurationManager._config.Database.ORM;
            if (orm !== 'Sequelize' && orm !== 'TypeORM') {
                throw new Error('Database configuration error! - Unspported/non-matching ORM');
            }
        }
        if (ConfigurationManager._config.Database.Type === 'NoSQL') {
            var orm = ConfigurationManager._config.Database.ORM;
            const dialect = process.env.DB_DIALECT;
            if (dialect === 'MongoDB') {
                if (orm !== 'Mongoose') {
                    throw new Error('Database configuration error! - Unspported/non-matching ORM');
                }
            }
        }
    }

}
