
export interface TenantFeatureSettingDomainModel {
    id         ?: string;
    TenantId   ?: string;
    Setting:{
        Integrations: {
            PatientInterface: boolean,
            ChatBotInterface: boolean,
            FormsInterface: boolean
        },
        Common: {
            VitalAndLabRecords: boolean,
            Nutrition:boolean,
            MedicationManagement:boolean,
            Reminders:boolean,
            ScheduledAssesments:boolean,
            ExcerciseAndFitness:boolean,
            FHIRResourceStorage:boolean,
            Careplans: {
                Default:boolean,
                Custom:boolean
            },
            EHIRIntegrations:boolean,
            ABDMIntegrations:boolean,
            DocumentManagement:boolean
        },
        PatientInterface: {
            GamificationAndAwards:boolean,
            CoursesAndLearningJourneys:boolean,
            CommunityAndUserGroups:boolean,
            AppointmentsAndVisits:boolean,
            DeviceIntegration: {
                Terra:boolean,
                SenseSemi:boolean
            },
            PatientReports: {
                Default:boolean,
                Custom:boolean
            }
        },
        ChatBotInterface: {
            FAQ: {
                Default:boolean,
               Custom:boolean
            },
            Integrations: {
                ClickUp:boolean,
               Slack:boolean
            },
            WhatsApp:boolean,
           Telegram:boolean,
           QuicksightDashboard:boolean,
           ChatPersonalization:boolean,
           CustomUserDBQueries:boolean,
           LocationContextualQueries:boolean,
           LocalizationSupport:boolean
        },
        FormsInterface: {
            Integrations: {
                KoboToolbox:boolean,
                ODK:boolean,
                GoogleForm:boolean
            },
            OfflineSupport:boolean,
            FieldApp:boolean
        }
    }
}
