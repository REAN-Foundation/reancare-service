import express from 'express';
import { TenantFeatureSettingSearchFilters } from '../../../domain.types/tenant/feature.setting/tenant.feature.setting.search.type';
import { TenantFeatureSettingDomainModel } from '../../../domain.types/tenant/feature.setting/tenant.feature.setting.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantFeatureSettingValidator extends BaseValidator {

    constructor() {
        super();
    }

    createOrUpdate = async (request: express.Request, update = false): Promise<TenantFeatureSettingDomainModel> => {

        const isUpdateRequest = update ? false : true;
        if (isUpdateRequest) {
            await this.validateUuid(request, 'TenantId', Where.Body, true, false);
        }
        await this.validateObject(request, 'Setting', Where.Body, isUpdateRequest, false);

        if ('Setting' in request.body) {
            await this.validateObject(request, 'Setting.Integrations', Where.Body, true, false);

            await this.validateBoolean(request, 'Setting.Integrations.PatientInterface', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Integrations.ChatBotInterface', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Integrations.FormsInterface', Where.Body, true, false);

            await this.validateObject(request, 'Setting.Common', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.VitalAndLabRecords', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.Nutrition', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.MedicationManagement', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.Reminders', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.ScheduledAssesments', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.ExcerciseAndFitness', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.FHIRResourceStorage', Where.Body, true, false);
            await this.validateObject(request, 'Setting.Common.Careplans', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.Careplans.Default', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.Careplans.Custom', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.EHIRIntegrations', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.ABDMIntegrations', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.Common.DocumentManagement', Where.Body, true, false);

            await this.validateObject(request, 'Setting.PatientInterface', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.PatientInterface.GamificationAndAwards', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.PatientInterface.CoursesAndLearningJourneys', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.PatientInterface.CommunityAndUserGroups', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.PatientInterface.AppointmentsAndVisits', Where.Body, true, false);
            await this.validateObject(request, 'Setting.PatientInterface.DeviceIntegration', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.PatientInterface.DeviceIntegration.Terra', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.PatientInterface.DeviceIntegration.SenseSemi', Where.Body, true, false);
            await this.validateObject(request, 'Setting.PatientInterface.PatientReports', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.PatientInterface.PatientReports.Default', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.PatientInterface.PatientReports.Custom', Where.Body, true, false);

            await this.validateObject(request, 'Setting.ChatBotInterface', Where.Body, true, false);
            await this.validateObject(request, 'Setting.ChatBotInterface.FAQ', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.FAQ.Default', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.FAQ.Custom', Where.Body, true, false);
            await this.validateObject(request, 'Setting.ChatBotInterface.Integrations', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.Integrations.ClickUp', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.Integrations.Slack', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.WhatsApp', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.Telegram', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.QuicksightDashboard', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.ChatPersonalization', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.CustomUserDBQueries', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.LocationContextualQueries', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.ChatBotInterface.LocalizationSupport', Where.Body, true, false);

            await this.validateObject(request, 'Setting.FormsInterface', Where.Body, true, false);
            await this.validateObject(request, 'Setting.FormsInterface.Integrations', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.FormsInterface.Integrations.KoboToolbox', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.FormsInterface.Integrations.ODK', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.FormsInterface.Integrations.GoogleForm', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.FormsInterface.OfflineSupport', Where.Body, true, false);
            await this.validateBoolean(request, 'Setting.FormsInterface.FieldApp', Where.Body, true, false);
        }
        this.validateRequest(request);

        const model: TenantFeatureSettingDomainModel = this.getDomainModel(request);
        if (update) {
            model.id = await this.getParamUuid(request, 'id');
        }
        return model;
    };

    search = async (request: express.Request): Promise<TenantFeatureSettingSearchFilters> => {

        await this.validateUuid(request, 'tenantId', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        const filters: TenantFeatureSettingSearchFilters = {
            TenantId : request.query.tenantId as string ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    };

    getDomainModel = (request):TenantFeatureSettingDomainModel => {
        const model: TenantFeatureSettingDomainModel = {
            TenantId : request.body.TenantId,
            Setting  : {
                Integrations : {
                    PatientInterface : request.body.Setting.Integrations.PatientInterface,
                    ChatBotInterface : request.body.Setting.Integrations.ChatBotInterface,
                    FormsInterface   : request.body.Setting.Integrations.FormsInterface
                },
                Common : {
                    VitalAndLabRecords   : request.body.Setting.Common.VitalAndLabRecors,
                    Nutrition            : request.body.Setting.Common.Nutrition,
                    MedicationManagement : request.body.Setting.Common.MedicationManagement,
                    Reminders            : request.body.Setting.Common.Reminders,
                    ScheduledAssesments  : request.body.Setting.Common.ScheduledAssesments,
                    ExcerciseAndFitness  : request.body.Setting.Common.ExcerciseAndFitness,
                    FHIRResourceStorage  : request.body.Setting.Common.FHIRResourceStorage,
                    Careplans            : {
                        Default : request.body.Setting.Common.Careplans.Default,
                        Custom  : request.body.Setting.Common.Careplans.Custom
                    },
                    EHIRIntegrations   : request.body.Setting.Common.EHIRIntegrations,
                    ABDMIntegrations   : request.body.Setting.Common.ABDMIntegrations,
                    DocumentManagement : request.body.Setting.Common.DocumentManagement
                },
                PatientInterface : {
                    GamificationAndAwards      : request.body.Setting.PatientInterface.GamificationAndAwards,
                    CoursesAndLearningJourneys : request.body.Setting.PatientInterface.CoursesAndLearningJourneys,
                    CommunityAndUserGroups     : request.body.Setting.PatientInterface.CommunityAndUserGroups,
                    AppointmentsAndVisits      : request.body.Setting.PatientInterface.AppointmentsAndVisits,
                    DeviceIntegration          : {
                        Terra     : request.body.Setting.PatientInterface.DeviceIntegration.Terra,
                        SenseSemi : request.body.Setting.PatientInterface.DeviceIntegration.SenseSemi
                    },
                    PatientReports : {
                        Default : request.body.Setting.PatientInterface.PatientReports.Default,
                        Custom  : request.body.Setting.PatientInterface.PatientReports.Custom
                    }
                },

                ChatBotInterface : {
                    FAQ : {
                        Default : request.body.Setting.ChatBotInterface.FAQ.Default,
                        Custom  : request.body.Setting.ChatBotInterface.FAQ.Custom
                    },
                    Integrations : {
                        ClickUp : request.body.Setting.ChatBotInterface.Integrations.ClickUp,
                        Slack   : request.body.Setting.ChatBotInterface.Integrations.Slack
                    },
                    WhatsApp                  : request.body.Setting.ChatBotInterface.WhatsApp,
                    Telegram                  : request.body.Setting.ChatBotInterface.Telegram,
                    QuicksightDashboard       : request.body.Setting.ChatBotInterface.QuicksightDashboard,
                    ChatPersonalization       : request.body.Setting.ChatBotInterface.ChatPersonalization,
                    CustomUserDBQueries       : request.body.Setting.ChatBotInterface.CustomUserDBQueries,
                    LocationContextualQueries : request.body.Setting.ChatBotInterface.LocationContextualQueries,
                    LocalizationSupport       : request.body.Setting.ChatBotInterface.LocalizationSupport
                },
                FormsInterface : {
                    Integrations : {
                        KoboToolbox : request.body.Setting.FormsInterface.Integrations.KoboToolbox,
                        ODK         : request.body.Setting.FormsInterface.Integrations.ODK,
                        GoogleForm  : request.body.Setting.FormsInterface.Integrations.GoogleForm
                    },
                    OfflineSupport : request.body.Setting.FormsInterface.OfflineSupport,
                    FieldApp       : request.body.Setting.FormsInterface.FieldApp
                }
            }
        };
        return model;
    };
    
}
