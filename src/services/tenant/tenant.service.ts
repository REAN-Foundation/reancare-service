import { ITenantRepo } from '../../database/repository.interfaces/tenant/tenant.repo.interface';
import { injectable, inject } from 'tsyringe';
import { TenantDomainModel } from '../../domain.types/tenant/tenant.domain.model';
import { TenantDto } from '../../domain.types/tenant/tenant.dto';
import { TenantSearchFilters, TenantSearchResults } from '../../domain.types/tenant/tenant.search.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { ChatBotSettings, CommonSettings, FormsIntegrations, FormsSettings, PatientAppSettings, TenantSettingsDomainModel, UserInterfaces, WeekDay } from '../../domain.types/tenant/tenant.settings.types';
import { ITenantSettingsRepo } from '../../database/repository.interfaces/tenant/tenant.settings.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantService {

    constructor(
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
        @inject('ITenantSettingsRepo') private _tenantSettingsRepo: ITenantSettingsRepo,
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

    public delete = async (id: uuid): Promise<boolean> => {
        return await this._tenantRepo.delete(id);
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
                Careplans       : true,
                Assessments     : true,
            },
            External : {
                FHIRStorage     : true,
                EHRIntegration  : true,
                ABDMIntegration : true,
            },
            AddOns : {
                HospitalSystems          : true,
                Gamification             : true,
                LearningJourney          : true,
                Community                : true,
                PatientSelfServicePortal : true,
                PatientStatusReports     : true,
                DocumentsManagement      : true,
                AppointmentReminders     : true,
                Organizations            : true,
                Cohorts                  : true,
                Notifications            : true,
                Newsfeeds                : true,
                Notices                  : true,
            },
            Analysis : {
                CustomQueries : true,
                Quicksight    : true,
            },
        };
        
        const patientApp: PatientAppSettings = {
            Exercise          : true,
            Nutrition         : true,
            DeviceIntegration : {
                Terra     : true,
                SenseSemi : true,
            },
        };

        const chatBot: ChatBotSettings = {
            Name            : 'Chatbot',
            Icon            : null,
            Description     : 'Chatbot for patient interaction',
            DefaultLanguage : 'en',
            MessageChannels : {
                WhatsApp : true,
                Telegram : true,
            },
            SupportChannels : {
                ClickUp : true,
                Slack   : true,
                Email   : true,
            },
            Personalization     : true,
            LocationContext     : true,
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
            UserInterfaces : healthcareInterfaces,
            Common         : common,
            PatientApp     : patientApp,
            ChatBot        : chatBot,
            Forms          : formSettings,
        };
        return model;
    };

    //#endregion

}
