import { ITenantRepo } from '../../database/repository.interfaces/tenant/tenant.repo.interface';
import { injectable, inject } from 'tsyringe';
import { TenantDomainModel, TenantSecretDomainModel, GetSecretDomainModel, TenantSchemaDomainModel } from '../../domain.types/tenant/tenant.domain.model';
import { TenantDto, TenantSchemaDto } from '../../domain.types/tenant/tenant.dto';
import { TenantSearchFilters, TenantSearchResults } from '../../domain.types/tenant/tenant.search.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { ChatBotSettings, CommonSettings, FormsIntegrations, FormsSettings, TenantSettingsDomainModel, FollowupSettings, FollowupSource, BotSecrets } from '../../domain.types/tenant/tenant.settings.types';
import { ITenantSettingsRepo } from '../../database/repository.interfaces/tenant/tenant.settings.interface';
import { Injector } from '../../startup/injector';
import { IFunctionService } from '../../modules/cloud.services/interfaces/functions.service.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantService {

    //  _lambdaService: AwsLambdaService = Injector.Container.resolve(AwsLambdaService);

    // _functionService: IFunctionService = Injector.Container.resolve(IFunctionService);

     constructor(
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
        @inject('ITenantSettingsRepo') private _tenantSettingsRepo: ITenantSettingsRepo,
        @inject('IFunctionService') private _functionService: IFunctionService,
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
        return await this._functionService.invokeFunction<TenantSchemaDto>(lambdaFunctionName, model);
    };

    public createSecret = async (model: TenantSecretDomainModel): Promise<BotSecrets> => {
        return this._functionService.invokeFunction<BotSecrets>('create-secrets-lambda-function', model);
    };

    public getSecret = async (model: GetSecretDomainModel): Promise<BotSecrets> => {
        return this._functionService.invokeFunction<BotSecrets>('get-secrets-lambda-function', model );
    };

    public updateSecret = async (model: TenantSecretDomainModel): Promise<BotSecrets> => {
        return this._functionService.invokeFunction<BotSecrets>('update-secrets-lambda-function', model);
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
            Feedback            : false,
            ReminderAppointment : false,
            AppointmentFollowup : false,
            ConversationHistory : false,
            Emojis              : false
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
            Common   : common,
            Followup : followup,
            ChatBot  : chatBot,
            Forms    : formSettings,
            Consent  : null
        };
        return model;
    };

    //#endregion

}
