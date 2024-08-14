import { ITenantSettingsRepo } from '../../database/repository.interfaces/tenant/tenant.settings.interface';
import { injectable, inject } from 'tsyringe';
import {
    ChatBotSettings,
    CommonSettings,
    FormsIntegrations,
    FormsSettings,
    UserInterfaces,
    PatientAppSettings,
    TenantSettingsDomainModel,
    TenantSettingsTypes,
    WeekDay
} from '../../domain.types/tenant/tenant.settings.types';
import { TenantSettingsDto } from '../../domain.types/tenant/tenant.settings.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantSettingsService {

    constructor(
        @inject('ITenantSettingsRepo') private _tenantSettingsRepo: ITenantSettingsRepo,
    ) {}

    //#region Publics

    createDefaultSettings = async (tenantId: uuid): Promise<TenantSettingsDto> => {
        const model: TenantSettingsDomainModel = this.getDefaultSettings();
        return await this._tenantSettingsRepo.createDefaultSettings(tenantId, model);
    };

    public getTenantSettings = async (tenantId: uuid): Promise<TenantSettingsDto> => {
        return await this._tenantSettingsRepo.getTenantSettings(tenantId);
    };

    public getTenantSettingsByType = async (tenantId: uuid, settingsType: TenantSettingsTypes)
        : Promise<any> => {
        const settings = await this._tenantSettingsRepo.getTenantSettings(tenantId);
        if (settingsType === TenantSettingsTypes.UserInterfaces) {
            return settings.UserInterfaces;
        }
        if (settingsType === TenantSettingsTypes.Common) {
            return settings.Common;
        }
        if (settingsType === TenantSettingsTypes.PatientApp) {
            return settings.PatientApp;
        }
        if (settingsType === TenantSettingsTypes.ChatBot) {
            return settings.ChatBot;
        }
        if (settingsType === TenantSettingsTypes.Forms) {
            return settings.Forms;
        }
        return settings;
    };

    public updateTenantSettingsByType = async (
        tenantId: uuid,
        settingsType: TenantSettingsTypes,
        settings: UserInterfaces|CommonSettings|PatientAppSettings|ChatBotSettings|FormsSettings)
            : Promise<TenantSettingsDto> => {
        if (settingsType === TenantSettingsTypes.UserInterfaces) {
            return await this._tenantSettingsRepo.updateHealthcareInterfaces(tenantId, settings as UserInterfaces);
        }
        if (settingsType === TenantSettingsTypes.Common) {
            return await this._tenantSettingsRepo.updateCommonSettings(tenantId, settings as CommonSettings);
        }
        if (settingsType === TenantSettingsTypes.PatientApp) {
            return await this._tenantSettingsRepo.updatePatientAppSettings(tenantId, settings as PatientAppSettings);
        }
        if (settingsType === TenantSettingsTypes.ChatBot) {
            return await this._tenantSettingsRepo.updateChatBotSettings(tenantId, settings as ChatBotSettings);
        }
        if (settingsType === TenantSettingsTypes.Forms) {
            return await this._tenantSettingsRepo.updateFormsSettings(tenantId, settings as FormsSettings);
        }
        return await this._tenantSettingsRepo.getTenantSettings(tenantId);
    };

    public updateTenantSettings = async (tenantId: uuid, model: TenantSettingsDomainModel): Promise<TenantSettingsDto> => {
        await this._tenantSettingsRepo.updateHealthcareInterfaces(tenantId, model.UserInterfaces);
        await this._tenantSettingsRepo.updateCommonSettings(tenantId, model.Common);
        await this._tenantSettingsRepo.updatePatientAppSettings(tenantId, model.PatientApp);
        await this._tenantSettingsRepo.updateChatBotSettings(tenantId, model.ChatBot);
        await this._tenantSettingsRepo.updateFormsSettings(tenantId, model.Forms);
        return await this._tenantSettingsRepo.getTenantSettings(tenantId);
    };

    //#endregion

    private getDefaultSettings = (): TenantSettingsDomainModel => {

        const healthcareInterfaces: UserInterfaces = {
            PatientApp : true,
            ChatBot    : true,
            Forms      : true,
        };
        const common: CommonSettings = {
            Clinical : {
                Vitals          : true,
                LabRecords      : true,
                Symptoms        : true,
                DrugsManagement : true,
                Medications     : true,
                Careplans       : false,
                Assessments     : true,
            },
            External : {
                FHIRStorage     : false,
                EHRIntegration  : false,
                ABDMIntegration : false,
            },
            AddOns : {
                HospitalSystems          : false,
                Gamification             : false,
                LearningJourney          : false,
                Community                : false,
                PatientSelfServicePortal : false,
                PatientStatusReports     : false,
                DocumentsManagement      : false,
                AppointmentReminders     : false,
                Organizations            : false,
                Cohorts                  : false,
                Notifications            : true,
                Newsfeeds                : false,
                Notices                  : false,
            },
            Analysis : {
                CustomQueries : false,
                Quicksight    : false,
            },
        };

        const patientApp: PatientAppSettings = {
            Exercise          : true,
            Nutrition         : true,
            DeviceIntegration : {
                Terra     : false,
                SenseSemi : false,
            },
        };

        const chatBot: ChatBotSettings = {
            Name            : 'Chatbot',
            Icon            : null,
            Description     : 'Chatbot for patient interaction',
            DefaultLanguage : 'en',
            MessageChannels : {
                WhatsApp : false,
                Telegram : true,
            },
            SupportChannels : {
                ClickUp : false,
                Slack   : false,
                Email   : false,
            },
            Personalization     : false,
            LocationContext     : false,
            Localization        : true,
            AppointmentFollowup : {
                UploadAppointmentDocument : false,
                AppointmentEhrApi         : false,
                AppointmentEhrApiDetails  : {
                    CustomApi        : false,
                    FhirApi          : false,
                    CustomApiDetails : {
                        Url         : null,
                        Credentials : {
                            UserName : null,
                            Password : null,
                        }
                    },
                    FhirApiDetails : {
                        Url         : null,
                        Credentials : {
                            UserName : null,
                            Password : null,
                        }
                    },
                    FollowupMechanism : {
                        ManualTrigger     : false,
                        ScheduleTrigger   : false,
                        ScheduleFrequency : {
                            Daily      : false,
                            Weekly     : false,
                            WeekDay    : WeekDay.Monday,
                            Monthly    : false,
                            DayOfMonth : 1
                        },
                        ScheduleTiming   : null,
                        FollowupMessages : false,
                        MessageFrequency : {
                            OneDayBefore  : false,
                            OneHourBefore : false,
                            OneWeekBefore : false
                        }
                    }
                }
            }
        };

        const forms: FormsIntegrations = {
            KoboToolbox : false,
            GoogleForm  : false,
            ODK         : false,
        };

        const formSettings: FormsSettings = {
            Integrations   : forms,
            OfflineSupport : false,
            FieldApp       : false,
        };

        const model: TenantSettingsDomainModel = {
            UserInterfaces : healthcareInterfaces,
            Common         : common,
            PatientApp     : patientApp,
            ChatBot        : chatBot,
            Forms          : formSettings,
        };

        return model;
    };

}
