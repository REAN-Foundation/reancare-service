import express from 'express';
import { 
    HealthcareInterfaces, 
    CommonSettings,
    PatientAppSettings,
    ChatBotSettings,
    FormsSettings,
    TenantSettingsDomainModel,
    TenantSettingsTypes,
} from '../../../domain.types/tenant/tenant.settings.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsValidator extends BaseValidator {
    constructor() {
        super();
    }

    updateHealthcareInterfaces = async (request: express.Request): Promise<HealthcareInterfaces> => {
        await this.validateBoolean(request, 'HealthcareInterfaces.PatientApp', Where.Body, true, false);
        await this.validateBoolean(request, 'HealthcareInterfaces.ChatBot', Where.Body, true, false);
        await this.validateBoolean(request, 'HealthcareInterfaces.Forms', Where.Body, true, false);

        this.validateRequest(request);

        const model: HealthcareInterfaces = {
            PatientApp: request.body.HealthcareInterfaces.PatientApp,
            ChatBot   : request.body.HealthcareInterfaces.ChatBot,
            Forms     : request.body.HealthcareInterfaces.Forms,
        };
        return model;
    };

    updateCommonSettings = async (request: express.Request): Promise<CommonSettings> => {

        await this.validateBoolean(request, 'Common.Clinical.Vitals', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.LabRecords', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Medications', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Careplans', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.DrugsManagement', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Symptoms', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Assessments', Where.Body, true, false);

        await this.validateBoolean(request, 'Common.External.FHIRStorage', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.External.EHRIntegration', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.External.ABDMIntegration', Where.Body, true, false);

        await this.validateBoolean(request, 'Common.Analysis.CustomQueries', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Analysis.Quicksight', Where.Body, true, false);

        await this.validateBoolean(request, 'Common.AddOns.Gamification', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.LearningJourney', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.Community', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.PatientSelfServicePortal', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.AppointmentReminders', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.PatientStatusReports', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.DocumentsManagement', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.HospitalSystems', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.Cohorts', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.Organizations', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.Notifications', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.Newsfeeds', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.AddOns.Notices', Where.Body, true, false);

        this.validateRequest(request);

        const model: CommonSettings = {
            Clinical : {
                Vitals         : request.body.Common.Clinical.Vitals,
                LabRecords     : request.body.Common.Clinical.LabRecords,
                DrugsManagement: request.body.Common.Clinical.DrugsManagement,
                Symptoms       : request.body.Common.Clinical.Symptoms,
                Medications    : request.body.Common.Clinical.Medications,
                Careplans      : request.body.Common.Clinical.Careplans,
                Assessments    : request.body.Common.Clinical.ScheduledAssesments,
            },
            External : {
                FHIRStorage    : request.body.Common.External.FHIRStorage,
                EHRIntegration: request.body.Common.External.EHIRIntegration,
                ABDMIntegration: request.body.Common.External.ABDMIntegration,
            },
            AddOns   : {
                Gamification            : request.body.Common.AddOns.Gamification,
                LearningJourney         : request.body.Common.AddOns.LearningJourney,
                Community               : request.body.Common.AddOns.Community,
                PatientSelfServicePortal: request.body.Common.AddOns.PatientSelfServicePortal,
                AppointmentReminders    : request.body.Common.AddOns.AppointmentReminders,
                PatientStatusReports    : request.body.Common.AddOns.PatientStatusReports,
                DocumentsManagement     : request.body.Common.AddOns.DocumentsManagement,
                HospitalSystems         : request.body.Common.AddOns.HospitalSystems,
                Cohorts                 : request.body.Common.AddOns.Cohorts,
                Organizations           : request.body.Common.AddOns.Organizations,
                Notifications           : request.body.Common.AddOns.Notifications,
                Newsfeeds               : request.body.Common.AddOns.Newsfeeds,
                Notices                 : request.body.Common.AddOns.Notices,
            },
            Analysis : {
                CustomQueries: request.body.Common.Analysis.CustomQueries,
                Quicksight   : request.body.Common.Analysis.Quicksight,
            },
        };

        return model;
    };

    updatePatientAppSettings = async (request: express.Request): Promise<PatientAppSettings> => {

        await this.validateBoolean(request, 'PatientApp.Exercise', Where.Body, true, false);
        await this.validateBoolean(request, 'PatientApp.Nutrition', Where.Body, true, false);
        await this.validateBoolean(request, 'PatientApp.DeviceIntegration.Terra', Where.Body, true, false);
        await this.validateBoolean(request, 'PatientApp.DeviceIntegration.SenseSemi', Where.Body, true, false);

        this.validateRequest(request);

        const model: PatientAppSettings = {
            Excercise: request.body.PatientApp.Exercise,
            Nutrition: request.body.PatientApp.Nutrition,
            DeviceIntegration: {
                Terra    : request.body.PatientApp.DeviceIntegration.Terra,
                SenseSemi: request.body.PatientApp.DeviceIntegration.SenseSemi,
            },
        };

        return model;
    };

    updateChatBotSettings = async (request: express.Request): Promise<ChatBotSettings> => {

        await this.validateString(request, 'ChatBot.Name', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.Description', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.Language', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.Icon', Where.Body, false, false);
        await this.validateString(request, 'ChatBot.MessageChannels.WhatsApp', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.MessageChannels.Telegram', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.SupportChannels.Email', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.SupportChannels.ClickUp', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.SupportChannels.Slack', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.Personalization', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.LocationContext', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.Localization', Where.Body, true, false);

        this.validateRequest(request);

        const model: ChatBotSettings = {
            Name               : request.body.ChatBot.Name,
            Description        : request.body.ChatBot.Description,
            DefaultLanguage    : request.body.ChatBot.Language,
            Icon               : request.body.ChatBot.Icon,
            MessageChannels    : {
                WhatsApp: request.body.ChatBot.MessageChannels.WhatsApp,
                Telegram: request.body.ChatBot.MessageChannels.Telegram,
            },
            SupportChannels    : {
                Email  : request.body.ChatBot.SupportChannels.Email,
                ClickUp: request.body.ChatBot.SupportChannels.ClickUp,
                Slack  : request.body.ChatBot.SupportChannels.Slack,
            },
            Personalization    : request.body.ChatBot.Personalization,
            LocationContext    : request.body.ChatBot.LocationContext,
            Localization       : request.body.ChatBot.Localization,
        };

        return model;
    };

    updateFormsSettings = async (request: express.Request): Promise<FormsSettings> => {

        await this.validateBoolean(request, 'Forms.Integrations.KoboToolbox', Where.Body, true, false);
        await this.validateBoolean(request, 'Forms.Integrations.ODK', Where.Body, true, false);
        await this.validateBoolean(request, 'Forms.Integrations.GoogleForm', Where.Body, true, false);
        await this.validateBoolean(request, 'Forms.OfflineSupport', Where.Body, true, false);
        await this.validateBoolean(request, 'Forms.FieldApp', Where.Body, true, false);

        this.validateRequest(request);

        const model: FormsSettings = {
            Integrations: {
                KoboToolbox: request.body.Forms.Integrations.KoboToolbox,
                ODK        : request.body.Forms.Integrations.ODK,
                GoogleForm : request.body.Forms.Integrations.GoogleForm,
            },
            OfflineSupport: request.body.Forms.OfflineSupport,
            FieldApp      : request.body.Forms.FieldApp,
        };

        return model;
    };

    updateTenantSettingsByType = async (request: express.Request, settingsType: TenantSettingsTypes)
        : Promise<HealthcareInterfaces|CommonSettings|PatientAppSettings|ChatBotSettings|FormsSettings> => {
        
        if (settingsType === TenantSettingsTypes.HealthcareInterfaces) {
            return await this.updateHealthcareInterfaces(request);
        }
        if (settingsType === TenantSettingsTypes.Common) {
            return await this.updateCommonSettings(request);
        }
        if (settingsType === TenantSettingsTypes.PatientApp) {
            return await this.updatePatientAppSettings(request);
        }
        if (settingsType === TenantSettingsTypes.ChatBot) {
            return await this.updateChatBotSettings(request);
        }
        if (settingsType === TenantSettingsTypes.Forms) {
            return await this.updateFormsSettings(request);
        }
        return null;
    };

    updateTenantSettings = async (request: express.Request): Promise<TenantSettingsDomainModel> => {

        const healthcareInterfaces = await this.updateHealthcareInterfaces(request);
        const commonSettings = await this.updateCommonSettings(request);
        const patientAppSettings = await this.updatePatientAppSettings(request);
        const chatBotSettings = await this.updateChatBotSettings(request);
        const formsSettings = await this.updateFormsSettings(request);

        this.validateRequest(request);

        const model: TenantSettingsDomainModel = {
            HealthcareInterfaces: healthcareInterfaces,
            Common              : commonSettings,
            PatientApp          : patientAppSettings,
            ChatBot             : chatBotSettings,
            Forms               : formsSettings,
        };

        return model;
    };
}
