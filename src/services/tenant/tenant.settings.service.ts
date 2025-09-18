import { ITenantSettingsRepo } from '../../database/repository.interfaces/tenant/tenant.settings.interface';
import { injectable, inject } from 'tsyringe';
import {
    ChatBotSettings,
    FormsIntegrations,
    FormsSettings,
    TenantSettingsDomainModel,
    TenantSettingsTypes,
    CommonSettings,
    FollowupSettings,
    FollowupSource } from '../../domain.types/tenant/tenant.settings.types';
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
        if (settingsType === TenantSettingsTypes.Common) {
            return settings.Common;
        }
        if (settingsType === TenantSettingsTypes.Followup) {
            return settings.Followup;
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
        settings: CommonSettings | FollowupSettings | ChatBotSettings | FormsSettings | TenantSettingsDto
    ): Promise<TenantSettingsDto> => {
        if (settingsType === TenantSettingsTypes.Common) {
            return await this._tenantSettingsRepo.updateCommonSettings(tenantId, settings as CommonSettings);
        }
        if (settingsType === TenantSettingsTypes.Followup) {
            return await this._tenantSettingsRepo.updateFollowupSettings(tenantId, settings as FollowupSettings);
        }
        if (settingsType === TenantSettingsTypes.ChatBot) {
            return await this._tenantSettingsRepo.updateChatBotSettings(tenantId, settings as ChatBotSettings);
        }
        if (settingsType === TenantSettingsTypes.Forms) {
            return await this._tenantSettingsRepo.updateFormsSettings(tenantId, settings as FormsSettings);
        }
        if (settingsType === TenantSettingsTypes.Consent) {
            return await this._tenantSettingsRepo.updateConsentSettings(tenantId, settings as TenantSettingsDto);
        }
        
        return await this._tenantSettingsRepo.getTenantSettings(tenantId);
    };

    public updateTenantSettings = async (tenantId: uuid, model: TenantSettingsDomainModel): Promise<TenantSettingsDto> => {
        await this._tenantSettingsRepo.updateCommonSettings(tenantId, model.Common);
        await this._tenantSettingsRepo.updateFollowupSettings(tenantId, model.Followup);
        await this._tenantSettingsRepo.updateChatBotSettings(tenantId, model.ChatBot);
        await this._tenantSettingsRepo.updateFormsSettings(tenantId, model.Forms);
        await this._tenantSettingsRepo.updateConsentSettings(tenantId, model.Consent);
        return await this._tenantSettingsRepo.getTenantSettings(tenantId);
    };

    //#endregion

    private getDefaultSettings = (): TenantSettingsDomainModel => {

        const common: CommonSettings = {
     
            UserInterfaces : {
                PatientApp    : true,
                ChatBot       : true,
                Forms         : false,
                PatientPortal : true,
                Followup      : false
            },

            Clinical : {
                Vitals : {
                    Name      : "Vitals",
                    Enabled   : true,
                    Navigable : true,
                },
                LabRecords : {
                    Name      : "Lab Records",
                    Enabled   : true,
                    Navigable : true,
                },
                Symptoms : {
                    Name      : "Symptoms",
                    Enabled   : true,
                    Navigable : true,
                },
                SymptomAssessments : {
                    Name      : "Symptom Assessments",
                    Enabled   : true,
                    Navigable : true,
                },
                DrugsManagement : {
                    Name      : "Drugs Management",
                    Enabled   : true,
                    Navigable : true,
                },
                Medications : {
                    Name      : "Medications",
                    Enabled   : true,
                    Navigable : true,
                },
                Careplans : {
                    Name      : "Careplans",
                    Enabled   : false,
                    Navigable : false,
                },
                Assessments : {
                    Name      : "Assessments",
                    Enabled   : true,
                    Navigable : true,
                },
                DailyAssessments : {
                    Name      : "Daily Assessments",
                    Enabled   : true,
                    Navigable : true,
                },
                Appointments : {
                    Name      : "Appointments",
                    Enabled   : true,
                    Navigable : true,
                },
                Visits : {
                    Name      : "Visits",
                    Enabled   : true,
                    Navigable : true,
                },
                Orders : {
                    Name      : "Orders",
                    Enabled   : true,
                    Navigable : true,
                },
                Documents : {
                    Name      : "Documents",
                    Enabled   : true,
                    Navigable : true,
                },
                PatientHealthReports : {
                    Name      : "Patient HealthReports",
                    Enabled   : true,
                    Navigable : true,
                },
            },
    
            Wellness : {
                Exercise : {
                    Name      : "Exercise",
                    Enabled   : true,
                    Navigable : true,
                },
                Nutrition : {
                    Name      : "Nutrition",
                    Enabled   : true,
                    Navigable : true,
                },
                Meditation : {
                    Name      : "Meditation",
                    Enabled   : true,
                    Navigable : true,
                },
                Priorities : {
                    Name      : "Priorities",
                    Enabled   : true,
                    Navigable : true,
                },
                Goals : {
                    Name      : "Goals",
                    Enabled   : true,
                    Navigable : true,
                },
                DeviceIntegration : {
                    Name      : "Device Integration",
                    Enabled   : true,
                    Navigable : true,
                }
            },

            EHR : {
                FHIRStorage : {
                    Name      : "FHIR Storage",
                    Enabled   : false,
                    Navigable : false,
                },
                EHRIntegration : {
                    Name      : "EHR Integration",
                    Enabled   : false,
                    Navigable : false,
                },
                ABDM : {
                    Name      : "ABDM",
                    Enabled   : false,
                    Navigable : false,
                },
            },

            Community : {
                UserGroups : {
                    Name      : "User Groups",
                    Enabled   : true,
                    Navigable : true,
                },
                Chat : {
                    Name      : "Chat",
                    Enabled   : true,
                    Navigable : true,
                },
            },

            Research : {
                Cohorts : {
                    Name      : "Cohorts",
                    Enabled   : false,
                    Navigable : false,
                },
            },

            Affiliations : {
                HealthCenters : {
                    Name      : "Health Centers",
                    Enabled   : true,
                    Navigable : true,
                },
                HealthSystems : {
                    Name      : "Health Systems",
                    Enabled   : true,
                    Navigable : true,
                },
            },

            Miscellaneous : {
                Gamification : {
                    Name      : "Gamification",
                    Enabled   : false,
                    Navigable : false,
                },
                Notifications : {
                    Name      : "Notifications",
                    Enabled   : true,
                    Navigable : true,
                },
                Newsfeeds : {
                    Name      : "News feeds",
                    Enabled   : false,
                    Navigable : false,
                },
                Notices : {
                    Name      : "Notices",
                    Enabled   : false,
                    Navigable : false,
                },
            },

            Educational : {
                Courses : {
                    Name      : "Courses",
                    Enabled   : true,
                    Navigable : true,
                },
                LearningJourney : {
                    Name      : "Learning Journey",
                    Enabled   : false,
                    Navigable : false,
                },
                KnowledgeNuggets : {
                    Name      : "Knowledge Nuggets",
                    Enabled   : true,
                    Navigable : true,
                },
            },

            Analysis : {
                CustomQueries : {
                    Name      : "Custom Queries",
                    Enabled   : false,
                    Navigable : false,
                },
                Quicksight : {
                    Name      : "Quicksight",
                    Enabled   : false,
                    Navigable : false,
                },
            },

            General : {
                ViewPersonRoles : {
                    Name      : "View PersonRoles",
                    Enabled   : true,
                    Navigable : true,
                },
                ViewUsers : {
                    Name      : "View Users",
                    Enabled   : true,
                    Navigable : true,
                },
            }
        };

        const followup: FollowupSettings = {
            Source : FollowupSource.None
        };
       
        const chatBot: ChatBotSettings = {
            Name                : 'Chatbot',
            OrganizationName    : null,
            OrganizationLogo    : null,
            OrganizationWebsite : null,
            Favicon             : null,
            Description         : null,
            DefaultLanguage     : 'en',
            SchemaName          : null,
            MessageChannels     : {
                WhatsApp : false,
                Telegram : false,
            },
            SupportChannels : {
                ClickUp : false,
                Slack   : false,
                Email   : false,
            },
            Personalization     : false,
            LocationContext     : false,
            Localization        : true,
            RemindersMedication : false,
            QnA                 : false,
            Consent             : true,
            WelcomeMessage      : true,
            Feedback            : false,
            ReminderAppointment : false,
            AppointmentFollowup : false,
            ConversationHistory : false,
            Emojis              : false,
            BasicAssessment     : false,
            BasicCarePlan       : false,
            Timezone            : '+05:30',
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
            Common   : common,
            Followup : followup,
            ChatBot  : chatBot,
            Forms    : formSettings,
            Consent  : null
        };

        return model;
    };

}
