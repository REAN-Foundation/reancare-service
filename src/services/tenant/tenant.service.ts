import { ITenantRepo } from '../../database/repository.interfaces/tenant/tenant.repo.interface';
import { injectable, inject } from 'tsyringe';
import { TenantDomainModel, TenantSecretDomainModel, GetSecretDomainModel, TenantSchemaDomainModel } from '../../domain.types/tenant/tenant.domain.model';
import { TenantDto, TenantSchemaDto } from '../../domain.types/tenant/tenant.dto';
import { TenantSearchFilters, TenantSearchResults } from '../../domain.types/tenant/tenant.search.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { ChatBotSettings, CommonSettings, FormsIntegrations, FormsSettings, TenantSettingsDomainModel, FollowupSettings, FollowupSource, BotSecrets } from '../../domain.types/tenant/tenant.settings.types';
import { VitalsThresholds } from '../../domain.types/tenant/vitals.thresholds.types';
import { ITenantSettingsRepo } from '../../database/repository.interfaces/tenant/tenant.settings.interface';
import * as DefaultVitalsThresholds from '../../../seed.data/default.vitals.thresholds.json';
import { Injector } from '../../startup/injector';
import { TenantSettingsMarketingService } from './marketing/tenant.settings.marketing.service';
import { AwsLambdaService } from '../../modules/cloud.services/aws.service';
import {
    TenantPromotionPayload,
    TargetEnvironment,
    TenantPromotionLambdaPayload,
    TenantPromotionLambdaResponse,
    PromotionToResponse,
    PromotionAction
} from '../../domain.types/tenant/tenant.promotion.types';
import { TenantSettingsService } from './tenant.settings.service';
import { ITenantSettingsMarketingRepo } from '../../database/repository.interfaces/tenant/marketing/tenant.settings.marketing.interface';
import { UserHelper } from '../../api/users/user.helper';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantService {

     _lambdaService: AwsLambdaService = Injector.Container.resolve(AwsLambdaService);

     _userHelper: UserHelper = null;
     
     constructor(
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
        @inject('ITenantSettingsRepo') private _tenantSettingsRepo: ITenantSettingsRepo,
        @inject('ITenantSettingsMarketingRepo') private _tenantSettingsMarketingRepo: ITenantSettingsMarketingRepo,
     ) {}

     //#region Publics

    create = async (model: TenantDomainModel): Promise<TenantDto> => {
        return await this._tenantRepo.create(model);
    };

    public getById = async (id: uuid): Promise<TenantDto> => {
        return await this._tenantRepo.getById(id);
    };

    public exists = async (id: uuid): Promise<boolean> => {
        return await this._tenantRepo.exists(id);
    };

    public search = async (filters: TenantSearchFilters): Promise<TenantSearchResults> => {
        var dtos = await this._tenantRepo.search(filters);
        return dtos;
    };

    public update = async (id: uuid, model: TenantDomainModel): Promise<TenantDto> => {
        return await this._tenantRepo.update(id, model);
    };

    public delete = async (id: uuid, hardDelete: boolean = false): Promise<boolean> => {
        return await this._tenantRepo.delete(id, hardDelete);
    };

    public createBotSchema = async (lambdaFunctionName: string, model: TenantSchemaDomainModel):
    Promise<TenantSchemaDto> => {
        return await this._lambdaService.invokeLambdaFunction<TenantSchemaDto>(lambdaFunctionName, model);
    };

    public createSecret = async (lambdaFunctionName: string, model: TenantSecretDomainModel): Promise<any> => {
        const secret = await this._lambdaService.invokeLambdaFunction<BotSecrets>(lambdaFunctionName, model);
        return await this.updateSecretResponse(secret);
    };

    public getSecret = async (lambdaFunctionName: string, model: GetSecretDomainModel): Promise<any> => {
        const secret = await this._lambdaService.invokeLambdaFunction<BotSecrets>(lambdaFunctionName, model );
        return await this.updateSecretResponse(secret);
    };

    public updateSecret = async (lambdaFunctionName: string, model: TenantSecretDomainModel): Promise<any> => {
        const secret = await this._lambdaService.invokeLambdaFunction<BotSecrets>(lambdaFunctionName, model);
        return await this.updateSecretResponse(secret);
    };

    public getTenantWithPhone = async (phone: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithPhone(phone);
    };

    public getTenantWithCode = async (code: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithCode(code);
    };

    public getTenantWithEmail = async (email: string): Promise<TenantDto> => {
        return await this._tenantRepo.getTenantWithEmail(email);
    };

    public promoteTenantUserAsAdmin = async (id: uuid, userId: uuid): Promise<boolean> => {
        return await this._tenantRepo.promoteTenantUserAsAdmin(id, userId);
    };

    public demoteAdmin = async (id: uuid, userId: uuid): Promise<boolean> => {
        return await this._tenantRepo.demoteAdmin(id, userId);
    };

    public getTenantStats = async (id: uuid): Promise<any> => {
        return await this._tenantRepo.getTenantStats(id);
    };

    public getTenantAdmins = async (id: uuid): Promise<any[]> => {
        return await this._tenantRepo.getTenantAdmins(id);
    };

    public getTenantRegularUsers = async (id: uuid): Promise<any[]> => {
        return await this._tenantRepo.getTenantRegularUsers(id);
    };

    public getActiveTenants = async (): Promise<TenantDto[]> => {
        return await this._tenantRepo.getActiveTenants();
    };

    public seedDefaultTenant = async (): Promise<TenantDto> => {
        var defaultTenant = await this._tenantRepo.getTenantWithCode('default');
        if (defaultTenant == null) {
            var tenant: TenantDomainModel = {
                Name        : 'default',
                Description : 'Default tenant',
                Code        : 'default',
                Phone       : '0000000000',
                Email       : 'support@reanfoundation.org',
            };
            var defaultTenant = await this._tenantRepo.create(tenant);
            const model: TenantSettingsDomainModel = this.getDefaultSettings();
            await this._tenantSettingsRepo.createDefaultSettings(defaultTenant.id, model);
            const marketingService = Injector.Container.resolve(TenantSettingsMarketingService);
            await marketingService.createDefaultSettings(defaultTenant.id, {});

            return defaultTenant;
        }
        else {
            var defaultTenant = await this._tenantRepo.getTenantWithCode('default');
            return defaultTenant;
        }
    };

    private getDefaultSettings = (): TenantSettingsDomainModel => {

        const common: CommonSettings = {

            UserInterfaces : {
                PatientApp    : true,
                ChatBot       : true,
                Forms         : false,
                PatientPortal : true,
                Followup      : false,
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
            Source : FollowupSource.None,
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
                WhatsApp : true,
                Telegram : true,
            },
            SupportChannels : {
                ClickUp : true,
                Slack   : true,
                Email   : true,
            },
            Personalization     : false,
            LocationContext     : false,
            Localization        : true,
            RemindersMedication : false,
            QnA                 : false,
            Consent             : true,
            WelcomeMessage      : true,
            WelcomeMessages     : null,
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
            KoboToolbox : true,
            GoogleForm  : true,
            ODK         : true,
        };

        const formSettings: FormsSettings = {
            Integrations   : forms,
            OfflineSupport : true,
            FieldApp       : true,
        };

        const model: TenantSettingsDomainModel = {
            Common           : common,
            Followup         : followup,
            ChatBot          : chatBot,
            Forms            : formSettings,
            Consent          : null,
            VitalsThresholds : DefaultVitalsThresholds as VitalsThresholds
        };
        return model;
    };

    private async updateSecretResponse(secret: BotSecrets): Promise<any> {
        return {
            "TelegramBotToken"                 : secret.telegram?.BotToken,
            "TelegramMediaPathUrl"             : secret.telegram?.MediaPathUrl,
            "WebhookTelegramClientUrlToken"    : secret.telegram?.WebhookClientUrlToken,
            "WebhookWhatsappClientHeaderToken" : secret.whatsapp?.WebhookClientHeaderToken,
            "WebhookWhatsappClientUrlToken"    : secret.whatsapp?.WebhookClientUrlToken,
            "WhatsappPhoneNumberId"            : secret.whatsapp?.PhoneNumberId,
            "MetaApiToken"                     : secret.meta?.ApiToken,
            "SlackTokenFeedback"               : secret.slack?.TokenFeedback,
            "SlackFeedbackChannelId"           : secret.slack?.FeedbackChannelId,
            "SlackSecretFeedback"              : secret.slack?.SecretFeedback,
            "WebhookClickupClientUrlToken"     : secret.clickup?.WebhookClientUrlToken,
            "ClickupAuthentication"            : secret.clickup?.Authentication,
            "ClickupListId"                    : secret.clickup?.ListId,
            "ClickupIssuesListId"              : secret.clickup?.IssuesListId,
            "ClickupCaseListId"                : secret.clickup?.CaseListId,
            "CustomMlModelUrl"                 : secret.ml?.CustomMlModelUrl,
            "DataBaseName"                     : secret.database?.DataBaseName,
        };
    }

    //#region Promotion Methods

    public preparePromotionPayload = async (
        tenantId: uuid,
        targetEnvironment: TargetEnvironment
    ): Promise<TenantPromotionPayload> => {
        const tenant = await this._tenantRepo.getById(tenantId);
        if (!tenant) {
            throw new Error('Tenant not found');
        }

        const settings = await this._tenantSettingsRepo.getTenantSettings(tenantId);

        const marketingSettings = await this._tenantSettingsMarketingRepo.getSettings(tenantId);

        const payload: TenantPromotionPayload = {
            SourceEnvironment : process.env.NODE_ENV,
            TargetEnvironment : targetEnvironment,
            Tenant            : {
                Name        : tenant.Name,
                Code        : tenant.Code,
                Description : tenant.Description,
                Phone       : tenant.Phone,
                Email       : tenant.Email,
            },
            Settings : {
                Common           : settings?.Common ?? null,
                Followup         : settings?.Followup ?? null,
                ChatBot          : settings?.ChatBot ?? null,
                Forms            : settings?.Forms ?? null,
                Consent          : settings?.Consent ?? null,
                CustomSettings   : settings?.CustomSettings ?? null,
                VitalsThresholds : settings?.VitalsThresholds ?? null,
            },
            MarketingSettings : {
                Styling : marketingSettings?.Styling ?? null,
                Content : marketingSettings?.Content ?? null,
            },
        };

        return payload;
    };

    public triggerPromotion = async (
        payload: TenantPromotionPayload
    ): Promise<TenantPromotionLambdaResponse> => {
        const lambdaFunctionName = process.env.TENANT_PROMOTION_LAMBDA_FUNCTION;
        if (!lambdaFunctionName) {
            throw new Error('Tenant promotion Lambda function name is not configured');
        }

        const lambdaPayload: TenantPromotionLambdaPayload = {
            TargetEnvironment : payload.TargetEnvironment,
            Payload           : payload,
        };

        const response = await this._lambdaService.invokeLambdaFunction<TenantPromotionLambdaResponse>(
            lambdaFunctionName,
            lambdaPayload
        );

        return response;
    };

    public processIncomingPromotion = async (
        payload: TenantPromotionPayload
    ): Promise<PromotionToResponse> => {
        const tenantCode = payload.Tenant.Code;

        const existingTenant = await this._tenantRepo.getTenantWithCode(tenantCode);

        if (existingTenant) {
            return await this.updateExistingTenantFromPromotion(existingTenant.id, payload);
        } else {
            return await this.createNewTenantFromPromotion(payload);
        }
    };

    private updateExistingTenantFromPromotion = async (
        tenantId: uuid,
        payload: TenantPromotionPayload
    ): Promise<PromotionToResponse> => {
        const tenantModel: TenantDomainModel = {
            Name        : payload.Tenant.Name,
            Description : payload.Tenant.Description,
        };
        await this._tenantRepo.update(tenantId, tenantModel);

        const tenantSettingsService = Injector.Container.resolve(TenantSettingsService);
        if (payload.Settings) {
            const settingsModel: TenantSettingsDomainModel = {
                Common           : payload.Settings.Common,
                Followup         : payload.Settings.Followup,
                ChatBot          : payload.Settings.ChatBot,
                Forms            : payload.Settings.Forms,
                Consent          : payload.Settings.Consent,
                CustomSettings   : payload.Settings.CustomSettings,
                VitalsThresholds : payload.Settings.VitalsThresholds,
            };
            await tenantSettingsService.updateTenantSettings(tenantId, settingsModel);
        }

        const marketingService = Injector.Container.resolve(TenantSettingsMarketingService);
        if (payload.MarketingSettings?.Styling) {
            await marketingService.updateSettingsByType(
                tenantId,
                'Styling' as any,
                payload.MarketingSettings.Styling
            );
        }
        if (payload.MarketingSettings?.Content) {
            await marketingService.updateSettingsByType(
                tenantId,
                'Content' as any,
                payload.MarketingSettings.Content
            );
        }

        return {
            TenantId   : tenantId,
            TenantCode : payload.Tenant.Code,
            TenantName : payload.Tenant.Name,
            Action     : PromotionAction.Updated,
        };
    };

    private createNewTenantFromPromotion = async (
        payload: TenantPromotionPayload
    ): Promise<PromotionToResponse> => {
        const tenantModel: TenantDomainModel = {
            Name        : payload.Tenant.Name,
            Code        : payload.Tenant.Code,
            Description : payload.Tenant.Description,
            Phone       : payload.Tenant.Phone,
            Email       : payload.Tenant.Email,
        };
        if (!this._userHelper) {
            this._userHelper = new UserHelper();
        }
        await this._userHelper.performDuplicatePersonCheck(tenantModel.Phone, tenantModel.Email);
        const tenant = await this._tenantRepo.create(tenantModel);
        if (!tenant) {
            throw new Error('Failed to create tenant');
        }

        const tenantSettingsService = Injector.Container.resolve(TenantSettingsService);
        if (payload.Settings) {
            await tenantSettingsService.createDefaultSettings(tenant.id, tenant.Code);

            const settingsModel: TenantSettingsDomainModel = {
                Common           : payload.Settings.Common,
                Followup         : payload.Settings.Followup,
                ChatBot          : payload.Settings.ChatBot,
                Forms            : payload.Settings.Forms,
                Consent          : payload.Settings.Consent,
                CustomSettings   : payload.Settings.CustomSettings,
                VitalsThresholds : payload.Settings.VitalsThresholds,
            };
            await tenantSettingsService.updateTenantSettings(tenant.id, settingsModel);
        } else {
            await tenantSettingsService.createDefaultSettings(tenant.id, tenant.Code);
        }

        const marketingService = Injector.Container.resolve(TenantSettingsMarketingService);
        await marketingService.createDefaultSettings(tenant.id, {
            Styling : payload.MarketingSettings?.Styling ?? null,
            Content : payload.MarketingSettings?.Content ?? null,
        });

        return {
            TenantId   : tenant.id,
            TenantCode : tenant.Code,
            TenantName : tenant.Name,
            Action     : PromotionAction.Created,
        };
    };

    //#endregion

}
