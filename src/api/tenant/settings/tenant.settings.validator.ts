import express from 'express';
import {
    UserInterfaces,
    ChatBotSettings,
    FormsSettings,
    TenantSettingsDomainModel,
    TenantSettingsTypes,
    CommonSettings,
    FollowupSettings,
    FollowupSource,
    ConsentSettings,
} from '../../../domain.types/tenant/tenant.settings.types';
import { BaseValidator, Where } from '../../base.validator';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsValidator extends BaseValidator {

    constructor() {
        super();
    }

    updateHealthcareInterfaces = async (request: express.Request): Promise<UserInterfaces> => {
        await this.validateBoolean(request, 'UserInterfaces.PatientApp', Where.Body, true, false);
        await this.validateBoolean(request, 'UserInterfaces.ChatBot', Where.Body, true, false);
        await this.validateBoolean(request, 'UserInterfaces.Forms', Where.Body, true, false);
        await this.validateBoolean(request,'UserInterfaces.PatientPortal', Where.Body, true, false);

        this.validateRequest(request);

        const model: UserInterfaces = {
            PatientApp    : request.body.UserInterfaces.PatientApp,
            ChatBot       : request.body.UserInterfaces.ChatBot,
            Forms         : request.body.UserInterfaces.Forms,
            PatientPortal : request.body.UserInterfaces.PatientPortal,
            Followup      : request.body.UserInterfaces.Followup
        };
        return model;
    };

    updateCommonSettings = async (request: express.Request): Promise<CommonSettings> => {

        await this.validateBoolean(request, 'Common.UserInterfaces.PatientApp', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.UserInterfaces.ChatBot', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.UserInterfaces.Forms', Where.Body, true, false);
        await this.validateBoolean(request,'Common.UserInterfaces.PatientPortal', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.UserInterfaces.Followup', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Vitals.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Vitals.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Vitals.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.LabRecords.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.LabRecords.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.LabRecords.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Symptoms.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Symptoms.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Symptoms.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.SymptomAssessments.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.SymptomAssessments.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.SymptomAssessments.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.DrugsManagement.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.DrugsManagement.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.DrugsManagement.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Medications.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Medications.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Medications.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Careplans.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Careplans.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Careplans.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Assessments.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Assessments.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Assessments.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.DailyAssessments.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.DailyAssessments.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.DailyAssessments.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Appointments.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Appointments.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Appointments.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Visits.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Visits.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Visits.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Orders.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Orders.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Orders.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.Documents.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.Documents.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.Documents.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Clinical.PatientHealthReports.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Clinical.PatientHealthReports.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Clinical.PatientHealthReports.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Wellness.Exercise.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Wellness.Exercise.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Wellness.Exercise.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Wellness.Nutrition.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Wellness.Nutrition.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Wellness.Nutrition.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Wellness.Meditation.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Wellness.Meditation.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Wellness.Meditation.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Wellness.Priorities.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Wellness.Priorities.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Wellness.Priorities.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Wellness.Goals.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Wellness.Goals.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Wellness.Goals.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Wellness.DeviceIntegration.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Wellness.DeviceIntegration.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Wellness.DeviceIntegration.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.EHR.FHIRStorage.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.EHR.FHIRStorage.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.EHR.FHIRStorage.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.EHR.EHRIntegration.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.EHR.EHRIntegration.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.EHR.EHRIntegration.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.EHR.ABDM.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.EHR.ABDM.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.EHR.ABDM.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Community.UserGroups.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Community.UserGroups.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Community.UserGroups.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Community.Chat.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Community.Chat.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Community.Chat.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Research.Cohorts.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Research.Cohorts.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Research.Cohorts.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Affiliations.HealthCenters.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Affiliations.HealthCenters.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Affiliations.HealthCenters.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Affiliations.HealthSystems.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Affiliations.HealthSystems.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Affiliations.HealthSystems.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Miscellaneous.Gamification.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Miscellaneous.Gamification.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Miscellaneous.Gamification.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Miscellaneous.Notifications.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Miscellaneous.Notifications.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Miscellaneous.Notifications.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Miscellaneous.Newsfeeds.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Miscellaneous.Newsfeeds.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Miscellaneous.Newsfeeds.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Miscellaneous.Notices.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Miscellaneous.Notices.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Miscellaneous.Notices.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Educational.Courses.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Educational.Courses.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Educational.Courses.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Educational.LearningJourney.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Educational.LearningJourney.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Educational.LearningJourney.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Educational.KnowledgeNuggets.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Educational.KnowledgeNuggets.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Educational.KnowledgeNuggets.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Analysis.CustomQueries.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Analysis.CustomQueries.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Analysis.CustomQueries.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.Analysis.Quicksight.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.Analysis.Quicksight.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.Analysis.Quicksight.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.General.ViewPersonRoles.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.General.ViewPersonRoles.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.General.ViewPersonRoles.Navigable', Where.Body, true, false);

        await this.validateString(request, 'Common.General.ViewUsers.Name', Where.Body, true, false,false,1);
        await this.validateBoolean(request, 'Common.General.ViewUsers.Enabled', Where.Body, true, false);
        await this.validateBoolean(request, 'Common.General.ViewUsers.Navigable', Where.Body, true, false);

        this.validateRequest(request);

        const model: CommonSettings = {
            UserInterfaces : {
                PatientApp    : request.body.Common.UserInterfaces.PatientApp,
                ChatBot       : request.body.Common.UserInterfaces.ChatBot,
                Forms         : request.body.Common.UserInterfaces.Forms,
                PatientPortal : request.body.Common.UserInterfaces.PatientPortal,
                Followup      : request.body.Common.UserInterfaces.Followup
            },

            Clinical : {
                Vitals               : request.body.Common.Clinical.Vitals,
                LabRecords           : request.body.Common.Clinical.LabRecords,
                Symptoms             : request.body.Common.Clinical.Symptoms,
                SymptomAssessments   : request.body.Common.Clinical.SymptomAssessments,
                DrugsManagement      : request.body.Common.Clinical.DrugsManagement,
                Medications          : request.body.Common.Clinical.Medications,
                Careplans            : request.body.Common.Clinical.Careplans,
                Assessments          : request.body.Common.Clinical.Assessments,
                DailyAssessments     : request.body.Common.Clinical.DailyAssessments,
                Appointments         : request.body.Common.Clinical.Appointments,
                Visits               : request.body.Common.Clinical.Visits,
                Orders               : request.body.Common.Clinical.Orders,
                Documents            : request.body.Common.Clinical.Documents,
                PatientHealthReports : request.body.Common.Clinical.PatientHealthReports,
            },

            Wellness : {
                Exercise          : request.body.Common.Wellness.Exercise,
                Nutrition         : request.body.Common.Wellness.Nutrition,
                Meditation        : request.body.Common.Wellness.Meditation,
                Priorities        : request.body.Common.Wellness.Priorities,
                Goals             : request.body.Common.Wellness.Goals,
                DeviceIntegration : {
                    Name      : request.body.Common.Wellness.DeviceIntegration.Name,
                    Enabled   : request.body.Common.Wellness.DeviceIntegration.Enabled,
                    Navigable : request.body.Common.Wellness.DeviceIntegration.Navigable,
                }
            },

            EHR : {
                FHIRStorage    : request.body.Common.EHR.FHIRStorage,
                EHRIntegration : request.body.Common.EHR.EHRIntegration,
                ABDM           : request.body.Common.EHR.ABDM,
            },

            Community : {
                UserGroups : request.body.Common.Community.UserGroups,
                Chat       : request.body.Common.Community.Chat
            },
           
            Research : {
                Cohorts : request.body.Common.Research.Cohorts,
            },

            Affiliations : {
                HealthCenters : request.body.Common.Affiliations.HealthCenters,
                HealthSystems : request.body.Common.Affiliations.HealthSystems
            },

            Miscellaneous : {
                Gamification  : request.body.Common.Miscellaneous.Gamification,
                Notifications : request.body.Common.Miscellaneous.Notifications,
                Newsfeeds     : request.body.Common.Miscellaneous.Newsfeeds,
                Notices       : request.body.Common.Miscellaneous.Notices
            },

            Educational : {
                Courses          : request.body.Common.Educational.Courses,
                LearningJourney  : request.body.Common.Educational.LearningJourney,
                KnowledgeNuggets : request.body.Common.Educational.KnowledgeNuggets
            },

            Analysis : {
                CustomQueries : request.body.Common.Analysis.CustomQueries,
                Quicksight    : request.body.Common.Analysis.Quicksight,
            },

            General : {
                ViewPersonRoles : request.body.Common.General.ViewPersonRoles,
                ViewUsers       : request.body.Common.General.ViewUsers
            }
        };

        return model;
    };

    updateFollowUpSettings = async (request: express.Request) : Promise<FollowupSettings> => {
        await this.validateEnum(request, 'Followup.Source', Where.Body, true, false, FollowupSource);
        if (request.body?.Followup?.Source === FollowupSource.File) {
            await this.validateObject(request, 'Followup.FileUploadSettings', Where.Body, true, false);
            await this.validateObject(request, 'Followup.FileUploadSettings.FileColumnFormat', Where.Body, true, false);
            await this.validateEnum(
                request,
                'Followup.FileUploadSettings.FileType',
                Where.Body,
                true,
                false,
                {
                    csv  : 'csv',
                    xlsx : 'xlsx',
                    json : 'json',
                    xml  : 'xml',
                    txt  : 'txt',
                    pdf  : 'pdf'
                }
            );

            const fileReminderSchedule = request.body?.Followup?.FileUploadSettings?.ReminderSchedule || [];
            for (let i = 0; i < fileReminderSchedule.length; i++) {
                const path = `Followup.FileUploadSettings.ReminderSchedule[${i}]`;
                Logger.instance().log(request.body.Followup.FileUploadSettings?.ReminderSchedule[i].Type);
                await this.validateEnum(
                    request,
                    `${path}.Type`,
                    Where.Body,
                    true,
                    false,
                    {
                        PreviousDay      : 'PreviousDay',
                        SameDayMorning   : 'SameDayMorning',
                        StartOfDay       : 'StartOfDay',
                        XHoursBefore     : 'XHoursBefore',
                        XMinutesBefore   : 'XMinutesBefore',
                        CustomTimeBefore : 'CustomTimeBefore',
                        AfterAppointment : 'AfterAppointment',
                        EndOfDay         : 'EndOfDay',
                        NoReminder       : 'NoReminder'
                    }
                );
                await this.validateInt(request, `${path}.OffsetValue`, Where.Body, false, false);
                await this.validateEnum(
                    request,
                    `${path}.OffsetUnit`,
                    Where.Body,
                    false,
                    false,
                    {
                        minutes : 'minutes',
                        hours   : 'hours',
                        days    : 'days'
                    }
                );
                await this.validateString(request, `${path}.TimeOfDay`, Where.Body, false, false);
            }
        }

        await this.validateEnum(
            request,
            'Followup.ApiIntegrationSettings.ScheduleFrequency',
            Where.Body,
            false,
            false,
            {
                daily   : 'daily',
                weekly  : 'weekly',
                monthly : 'monthly'
            }
        );

        const MAX_REMINDER_ITEMS = 20;

        const apiReminderSchedule = request.body?.Followup?.ApiIntegrationSettings?.ReminderSchedule || [];
        for (let i = 0; i < Math.min(apiReminderSchedule.length, MAX_REMINDER_ITEMS); i++) {
            const path = `Followup.ApiIntegrationSettings.ReminderSchedule[${i}]`;
            await this.validateEnum(
                request,
                `${path}.Type`,
                Where.Body,
                true,
                false,
                {
                    PreviousDay      : 'PreviousDay',
                    SameDayMorning   : 'SameDayMorning',
                    StartOfDay       : 'StartOfDay',
                    XHoursBefore     : 'XHoursBefore',
                    XMinutesBefore   : 'XMinutesBefore',
                    CustomTimeBefore : 'CustomTimeBefore',
                    AfterAppointment : 'AfterAppointment',
                    EndOfDay         : 'EndOfDay',
                    NoReminder       : 'NoReminder'
                }
            );
            await this.validateInt(request, `${path}.OffsetValue`, Where.Body, false, false);
            await this.validateEnum(
                request,
                `${path}.OffsetUnit`,
                Where.Body,
                false,
                false,
                {
                    minutes : 'minutes',
                    hours   : 'hours',
                    days    : 'days'
                }
            );
            await this.validateString(request, `${path}.TimeOfDay`, Where.Body, false, false);
        }
        if (request.body?.Followup?.Source === FollowupSource.Api) {
            await this.validateEnum(
                request,
                'Followup.ApiIntegrationSettings.Auth.Method',
                Where.Body,
                false,
                false,
                {
                    GET    : 'GET',
                    POST   : 'POST',
                    PUT    : 'PUT',
                    DELETE : 'DELETE',
                    PATCH  : 'PATCH'
                }
            );

            await this.validateString(request, 'Followup.ApiIntegrationSettings.Auth.Url', Where.Body, false, false);
            await this.validateEnum(
                request,
                'Followup.ApiIntegrationSettings.Auth.ResponseType',
                Where.Body,
                false,
                false,
                {
                    json : 'json',
                    text : 'text',
                    form : 'form',
                    xml  : 'xml'
                }
            );

            await this.validateString(request, 'Followup.ApiIntegrationSettings.Auth.TokenPath', Where.Body, false, false);
            await this.validateEnum(
                request,
                'Followup.ApiIntegrationSettings.Auth.TokenInjection.Location',
                Where.Body,
                false,
                false,
                {
                    header : 'header',
                    query  : 'query',
                    body   : 'body'
                }
            );

            await this.validateString(request, 'Followup.ApiIntegrationSettings.Auth.TokenInjection.Key', Where.Body, false, false);
            await this.validateString(request, 'ApiIntegrationSettings.Auth.TokenInjection.Prefix', Where.Body, false, false);

            await this.validateEnum(
                request,
                'Followup.ApiIntegrationSettings.Fetch.Method',
                Where.Body,
                true,
                false,
                {
                    GET    : 'GET',
                    POST   : 'POST',
                    PUT    : 'PUT',
                    DELETE : 'DELETE',
                    PATCH  : 'PATCH'
                }
            );

            await this.validateString(request, 'Followup.ApiIntegrationSettings.Fetch.Url', Where.Body, true, false);
            await this.validateEnum(
                request,
                'Followup.ApiIntegrationSettings.Fetch.ResponseType',
                Where.Body,
                false,
                false,
                {
                    json : 'json',
                    text : 'text',
                    form : 'form',
                    xml  : 'xml'
                }
            );

            await this.validateString(request, 'Followup.ApiIntegrationSettings.Fetch.ResponseField', Where.Body, false, false);
           
        }
        const model: FollowupSettings = {
            Source : request.body.Followup.Source,
        };
        if (request.body.Followup.Source === FollowupSource.File) {
            model.FileUploadSettings = {
                FileColumnFormat : JSON.stringify(request.body.Followup.FileUploadSettings.FileColumnFormat),
                FileType         : request.body.Followup.FileUploadSettings.FileType,
                ReminderSchedule : request.body.Followup.FileUploadSettings.ReminderSchedule
            };
        }

        if (request.body.Followup.Source === FollowupSource.Api) {
            model.ApiIntegrationSettings = {
                Auth              : request.body.Followup.ApiIntegrationSettings.Auth,
                Fetch             : request.body.Followup.ApiIntegrationSettings.Fetch,
                ReminderSchedule  : request.body.Followup.ApiIntegrationSettings.ReminderSchedule,
                ScheduleFrequency : request.body.Followup.ApiIntegrationSettings.ScheduleFrequency
            };
        }
        return model;
    };

    updateChatBotSettings = async (request: express.Request): Promise<ChatBotSettings> => {
        await this.validateString(request, 'ChatBot.Name', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.OrganizationName', Where.Body, false, false);
        await this.validateString(request, 'ChatBot.OrganizationLogo', Where.Body, false, false);
        await this.validateString(request, 'ChatBot.OrganizationWebsite', Where.Body, false, false);
        await this.validateString(request, 'ChatBot.Description', Where.Body, false, false);
        await this.validateString(request, 'ChatBot.DefaultLanguage', Where.Body, false, false);
        await this.validateString(request, 'ChatBot.Favicon', Where.Body, false, false);
        await this.validateString(request, 'ChatBot.SchemaName', Where.Body, false, false);
        await this.validateBoolean(request, 'ChatBot.MessageChannels.WhatsApp', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.MessageChannels.Telegram', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.SupportChannels.Email', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.SupportChannels.ClickUp', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.SupportChannels.Slack', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.Personalization', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.LocationContext', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.Localization', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.RemindersMedication', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.QnA', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.Consent', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.WelcomeMessage', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.Feedback', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.ReminderAppointment', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.AppointmentFollowup', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.ConversationHistory', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.Emojis', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.BasicAssessment', Where.Body, true, false);
        await this.validateBoolean(request, 'ChatBot.BasicCarePlan', Where.Body, true, false);
        await this.validateString(request, 'ChatBot.Timezone', Where.Body, false, false);
      
        const model: ChatBotSettings = {
            Name                : request.body.ChatBot.Name,
            OrganizationName    : request.body.ChatBot.OrganizationName,
            OrganizationLogo    : request.body.ChatBot.OrganizationLogo,
            OrganizationWebsite : request.body.ChatBot.OrganizationWebsite,
            Description         : request.body.ChatBot.Description,
            DefaultLanguage     : request.body.ChatBot.DefaultLanguage,
            Favicon             : request.body.ChatBot.Favicon,
            SchemaName          : request.body.ChatBot.SchemaName,
            MessageChannels     : {
                WhatsApp : request.body.ChatBot.MessageChannels.WhatsApp,
                Telegram : request.body.ChatBot.MessageChannels.Telegram,
            },
            SupportChannels : {
                Email   : request.body.ChatBot.SupportChannels.Email,
                ClickUp : request.body.ChatBot.SupportChannels.ClickUp,
                Slack   : request.body.ChatBot.SupportChannels.Slack,
            },
            Personalization     : request.body.ChatBot.Personalization,
            LocationContext     : request.body.ChatBot.LocationContext,
            Localization        : request.body.ChatBot.Localization,
            RemindersMedication : request.body.ChatBot.RemindersMedication,
            QnA                 : request.body.ChatBot.QnA,
            Consent             : request.body.ChatBot.Consent,
            WelcomeMessage      : request.body.ChatBot.WelcomeMessage,
            Feedback            : request.body.ChatBot.Feedback,
            ReminderAppointment : request.body.ChatBot.ReminderAppointment,
            AppointmentFollowup : request.body.ChatBot.AppointmentFollowup,
            ConversationHistory : request.body.ChatBot.ConversationHistory,
            Emojis              : request.body.ChatBot.Emojis,
            BasicAssessment     : request.body.ChatBot.BasicAssessment,
            BasicCarePlan       : request.body.ChatBot.BasicCarePlan,
            Timezone            : request.body.ChatBot.Timezone,

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
            Integrations : {
                KoboToolbox : request.body.Forms.Integrations.KoboToolbox,
                ODK         : request.body.Forms.Integrations.ODK,
                GoogleForm  : request.body.Forms.Integrations.GoogleForm,
            },
            OfflineSupport : request.body.Forms.OfflineSupport,
            FieldApp       : request.body.Forms.FieldApp,
        };

        return model;
    };

    updateConsentSettings = async (request: express.Request): Promise<ConsentSettings> => {
        if (!request.body?.Consent) {
            return null;
        }
        await this.validateUuid(request, 'Consent.TenantId', Where.Body, true, false);
        await this.validateString(request, 'Consent.Name', Where.Body, false, false);
        await this.validateString(request, 'Consent.TenantCode', Where.Body, true, false, false, 1);
        await this.validateString(request, 'Consent.DefaultLanguage', Where.Body, true, false, false, 1);
        await this.validateArray(request, 'Consent.Messages', Where.Body, true, false, 1);

        const MAX_MESSAGES = 25;

        const messages = request.body?.Consent?.Messages || [];
        for (let i = 0; i < Math.min(messages.length, MAX_MESSAGES); i++) {
            const path = `Consent.Messages[${i}]`;
            await this.validateString(request, `${path}.LanguageCode`, Where.Body, true, false, false, 1);
            await this.validateString(request, `${path}.Content`, Where.Body, true, false, false, 1);
            await this.validateString(request, `${path}.WebsiteURL`, Where.Body, true, false, false, 1);
        }

        const model: ConsentSettings = {
            TenantId        : request.body.Consent.TenantId,
            TenantName      : request.body.Consent.TenantName,
            TenantCode      : request.body.Consent.TenantCode,
            DefaultLanguage : request.body.Consent.DefaultLanguage,
            Messages        : request.body.Consent.Messages,
        };

        return model;
    };

    updateTenantSettingsByType = async (request: express.Request, settingsType: TenantSettingsTypes)
    : Promise<CommonSettings | FollowupSettings | ChatBotSettings | FormsSettings | ConsentSettings> => {
        if (settingsType === TenantSettingsTypes.Common) {
            return await this.updateCommonSettings(request);
        }
        if (settingsType === TenantSettingsTypes.Followup) {
            return await this.updateFollowUpSettings(request);
        }
        if (settingsType === TenantSettingsTypes.ChatBot) {
            return await this.updateChatBotSettings(request);
        }
        if (settingsType === TenantSettingsTypes.Forms) {
            return await this.updateFormsSettings(request);
        }
        if (settingsType === TenantSettingsTypes.Consent) {
            return await this.updateConsentSettings(request);
        }
        return null;
    };

    updateTenantSettings = async (request: express.Request): Promise<TenantSettingsDomainModel> => {

        const commonSettings = await this.updateCommonSettings(request);
        const followup = await this.updateFollowUpSettings(request);
        const chatBotSettings = await this.updateChatBotSettings(request);
        const formsSettings = await this.updateFormsSettings(request);
        const consentSettings = await this.updateConsentSettings(request);

        this.validateRequest(request);

        const model: TenantSettingsDomainModel = {
            Common   : commonSettings,
            Followup : followup,
            ChatBot  : chatBotSettings,
            Forms    : formsSettings,
            Consent  : consentSettings
        };

        return model;
    };

}
