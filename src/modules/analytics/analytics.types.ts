import { uuid } from "../../domain.types/miscellaneous/system.types";

export interface AnalyticsEvent {
    TenantId       : uuid | null;
    UserId         : uuid;
    SessionId      : uuid | null;
    ResourceId     : uuid | null;
    ResourceType   : string;
    SourceName     : string;
    SourceVersion  : string;
    EventName      : string;
    EventSubject   : string;
    EventCategory  : string;
    ActionType     : string;
    ActionStatement: string;
    Timestamp      : Date;
    Attributes     : any;
}

export enum AnalyticsEventCategory  {
    UserAccount     = "user-account",
    LoginSession    = "login-session",
    AppScreenVisit  = "app-screen-visit",
    Medication      = "medication",
    Appointment     = "appointment",
    Symptoms        = "symptoms",
    Vitals          = "vitals",
    LabRecords      = "lab-records",
    Documents       = "documents",
    Careplan        = "careplan",
    CareplanTask    = "careplan-task",
    UserTask        = "user-task",
    Communication   = "communication",
    Notification    = "notification",
    Exercise        = "exercise",
    Nutrition       = "nutrition",
    WaterIntake     = "water-intake",
    Mood            = "mood",
    Sleep           = "sleep",
    Steps           = "steps",
    Device          = "device",
    Survey          = "survey",
    Assessment      = "assessment",
    DailyAssessment = "daily-assessment",
    Forms           = "forms",
    Goals           = "goals",
    Chatbot         = "chatbot",
    Reminders       = "reminders",
    Settings        = "settings",
    Feedback        = "feedback",
    Support         = "support",
}

export enum AnalyticsEventType {
    
    // User account events
    UserCreate = "user-create",
    UserUpdate = "user-update",
    UserDelete = "user-delete",

    UserPasswordChange = "user-password-change",
    UserPasswordReset = "user-password-reset",
    UserSendPasswordResetCode = "user-send-password-reset-code",
    UserEmailChange = "user-email-change",
    UserPhoneChange = "user-phone-change",
    UserMetadataUpdate = "user-metadata-update",

    // User login session events
    UserLoginWithPassword = "user-login-with-password",
    UserLoginWithOtp = "user-login-with-otp",
    UserGenerateOtp = "user-generate-otp",
    UserLogout = "user-logout",

    // User profile events
    PatientHealthProfileUpdate = "patient-health-profile-update",

    // Screen events
    ScreenEntry = "screen-entry",
    ScreenExit = "screen-exit",
    ScreenButtonClick = "screen-button-click",

    // Medication events
    MedicationCreate = "medication-create",
    MedicationUpdate = "medication-update",
    MedicationDelete = "medication-delete",
    // Medication schedule events
    MedicationScheduleTaken = "medication-schedule-taken",
    MedicationScheduleMissed = "medication-schedule-missed",
    // Medication refill events
    MedicationRefill = "medication-refill",
    MedicationRefillRequest = "medication-refill-request",

    // Drug order events
    DrugOrderCreate = "drug-order-create",
    DrugOrderUpdate = "drug-order-update",
    DrugOrderDelete = "drug-order-delete",
    DrugOrderSend = "drug-order-send",
    DrugOrderRead = "drug-order-read",
    DrugsDelivered = "drugs-delivered",
    DrugsDeliveredAgainstOrder = "drug-delivered-against-order",
    DrugsReturned = "drugs-returned",

    // Symptom events
    SymptomAdd = "symptom-add",
    SymptomUpdate = "symptom-update",
    SymptomDelete = "symptom-delete",

    // Biometrics / Vitals events
    VitalAddPulse = "vital-add-pulse",
    VitalAddTemperature = "vital-add-temperature",
    VitalAddBloodPressure = "vital-add-blood-pressure",
    VitalAddBloodSugar = "vital-add-blood-sugar",
    VitalAddWeight = "vital-add-weight",
    VitalAddHeight = "vital-add-height",
    VitalAddOxygenSaturation = "vital-add-oxygen-saturation",
    VitalAddRespiratoryRate = "vital-add-respiratory-rate",

    VitalAlertTriggered = "vital-alert-triggered",
    VitalAlertResolved = "vital-alert-resolved",

    VitalSearch = "vital-search",

    // Lab test events
    LabRecordAdd = "lab-record-add",
    LabRecordSearch = "lab-record-search",
    LabOrderCreate = "lab-order-create",
    LabOrderUpdate = "lab-order-update",
    LabOrderDelete = "lab-order-delete",
    LabOrderSend = "lab-order-send",
    LabOrderRead = "lab-order-read",
    LabTestsDone = "lab-tests-done",
    LabResultsSend = "lab-results-send",
    LabResultsRead = "lab-results-read",
    LabResultsUpdate = "lab-results-update",
    LabResultsDelete = "lab-results-delete",

    // Patient documents
    DocumentUpload = "document-upload",
    DocumentDelete = "document-delete",
    DocumentShare = "document-share",
    DocumentUnshare = "document-unshare",
    DocumentSearch = "document-search",

    // Communication events
    SMSSend = "sms-send",
    SMSDelivered = "sms-delivered",
    SMSRead = "sms-read",
    EmailSend = "email-send",
    EmailDelivered = "email-delivered",
    EmailRead = "email-read",
    WhatsAppMessageSend = "whatsapp-message-send",
    WhatsAppMessageDelivered = "whatsapp-message-delivered",
    WhatsAppMessageRead = "whatsapp-message-read",
    TelegramMessageSend = "telegram-message-send",
    TelegramMessageDelivered = "telegram-message-delivered",
    TelegramMessageRead = "telegram-message-read",
    PushNotificationSend = "push-notification-send",
    PushNotificationDelivered = "push-notification-delivered",
    PushNotificationRead = "push-notification-read",
    WebNotificationSend = "web-notification-send",
    WebNotificationDelivered = "web-notification-delivered",
    WebNotificationRead = "web-notification-read",

    // Notification events
    NotificationSend = "notification-send",
    NotificationDelivered = "notification-delivered",
    NotificationRead = "notification-read",
    NotificationResponse = "notification-response",

    // Careplan
    CareplanEnrollment = "careplan-enrollment",
    CareplanStart = "careplan-start",
    CareplanStop = "careplan-stop",
    CareplanComplete = "careplan-complete",

    //Careplan tasks
    CareplanTaskStart = "careplan-task-start",
    CareplanTaskComplete = "careplan-task-complete",
    CareplanTaskCancel = "careplan-task-cancel",
    CareplanTaskFail = "careplan-task-fail",
    CareplanTaskReschedule = "careplan-task-reschedule",

    // User task events
    UserTaskStart = "user-task-start",
    UserTaskComplete = "user-task-complete",
    UserTaskCancel = "user-task-cancel",
    UserTaskFail = "user-task-fail",
    UserTaskReschedule = "user-task-reschedule",
    UserTaskUpdate = "user-task-update",

    // User goal events
    GoalCreate = "goal-create",
    GoalStart = "goal-start",
    GoalComplete = "goal-complete",
    GoalCancel = "goal-cancel",
    GoalFail = "goal-fail",
    GoalUpdate = "goal-update",

    // Exercise events
    ExerciseStart = "exercise-start",
    ExerciseComplete = "exercise-complete",
    ExerciseCancel = "exercise-cancel",
    ExerciseFail = "exercise-fail",
    ExerciseUpdate = "exercise-update",

    // Meditation events
    MeditationStart = "meditation-start",
    MeditationComplete = "meditation-complete",

    // Nutrition events
    NutritionStart = "nutrition-start",
    NutritionComplete = "nutrition-complete",
    NutritionCancel = "nutrition-cancel",
    NutritionFail = "nutrition-fail",
    NutritionUpdate = "nutrition-update",

    // Water intake events
    WaterIntakeAdd = "water-intake-add",
    WaterIntakeUpdate = "water-intake-update",
    WaterIntakeDelete = "water-intake-delete",

    // Stand events
    StandRecordAdd = "stand-record-add",

    // Step events
    StepRecordAdd = "step-record-add",

    // Sleep events
    SleepRecordAdd = "sleep-record-add",

    // Mood events
    MoodRecordAdd = "mood-record-add",

    // Device events
    DeviceConnect = "device-connect",
    DeviceDisconnect = "device-disconnect",
    DeviceSync = "device-sync",
    DeviceDataRecord = "device-data-record",
    DeviceFirmwareUpdate = "device-firmware-update",
    DeviceBatteryLow = "device-battery-low",
    DeviceBatteryCritical = "device-battery-critical",
    DeviceError = "device-error",
    DevicePair = "device-pair",
    DeviceUnpair = "device-unpair",
    DeviceSearch = "device-search",
    DeviceUpdate = "device-update",
    DeviceDelete = "device-delete",
    DeviceMetadataUpdate = "device-metadata-update",
    DeviceHealthCheck = "device-health-check",
    DeviceAlertTriggered = "device-alert-triggered",

    // Survey events
    SurveyRequestSend = "survey-request-send",
    SurveyResponse = "survey-response",
    SurveyComplete = "survey-complete",
    SurveyCancel = "survey-cancel",
    SurveyUpdate = "survey-update",

    // Appointment events
    AppointmentCreate = "appointment-create",
    AppointmentUpdate = "appointment-update",
    AppointmentDelete = "appointment-delete",
    AppointmentStart = "appointment-start",
    AppointmentEnd = "appointment-end",
    AppointmentCancel = "appointment-cancel",
    AppointmentReschedule = "appointment-reschedule",
    AppointmentCheckIn = "appointment-check-in",
    AppointmentCheckOut = "appointment-check-out",

    // Emergency events
    EmergencyCall = "emergency-call",
    EmergencyEvent = "emergency-event",

    // Payment events
    PaymentInitiate = "payment-initiate",
    PaymentSuccess = "payment-success",
    PaymentFail = "payment-fail",
    PaymentRefund = "payment-refund",

    // Subscription events
    SubscriptionStart = "subscription-start",
    SubscriptionEnd = "subscription-end",
    SubscriptionRenew = "subscription-renew",
    SubscriptionCancel = "subscription-cancel",
    SubscriptionUpgrade = "subscription-upgrade",
    SubscriptionDowngrade = "subscription-downgrade",

    // Feedback events
    FeedbackRequest = "feedback-request",
    FeedbackResponse = "feedback-response",

    // Assessment events
    AssessmentTemplateCreate = "assessment-template-create",
    AssessmentTemplateUpdate = "assessment-template-update",
    AssessmentTemplateDelete = "assessment-template-delete",
    AssessmentCreate = "assessment-create",
    AssessmentStart = "assessment-start",
    AssessmentComplete = "assessment-complete",
    AssessmentCancel = "assessment-cancel",
    AssessmentQuestionAnswered = "assessment-question-answered",

    // Daily assessments
    DailyAssessmentCreate = "daily-assessment-create",
    DailyAssessmentStart = "daily-assessment-start",
    DailyAssessmentComplete = "daily-assessment-complete",
    DailyAssessmentCancel = "daily-assessment-cancel",
    DailyAssessmentQuestionAnswered = "daily-assessment-question-answered",

    // Energy level assessment events
    EnergyLevelQuestionAnswered = "energy-level-question-answered",

    // Form events
    FormAnsweringStart = "form-answering-start",
    FormAnsweringCancel = "form-answering-cancel",
    FormQuestionAnswered = "form-question-answered",
    FormPresented = "form-presented",
    FormSubmitted = "form-submitted",
    FormDraftSaved = "form-draft-saved",
    FormDraftDeleted = "form-draft-deleted",

    // Chatbot events
    ChatbotSentMessage = "chatbot-sent-message",
    ChatbotMessageDelivered = "chatbot-message-delivered",
    ChatbotMessageRead = "chatbot-message-read",
    ChatbotReceivedMessage = "chatbot-received-message",
    ChatbotUnableToAnswer = "chatbot-unable-to-answer",
    ChatbotFallbackTriggered = "chatbot-fallback-triggered",
    ChatbotHandoverToHuman = "chatbot-handover-to-human",

    // QnA message events
    QnAMessageIdentified = "qna-message-identified",
    QnAMessageAnswered = "qna-message-answered",

    // Reminders
    ReminderCreate = "reminder-create",
    ReminderUpdate = "reminder-update",
    ReminderDelete = "reminder-delete",
    ReminderSend = "reminder-send",
    ReminderDelivered = "reminder-delivered",
    ReminderRead = "reminder-read",
    ReminderResponse = "reminder-response",

    // Tenant events
    TenantCreate = "tenant-create",
    TenantUpdate = "tenant-update",
    TenantDelete = "tenant-delete",

    // Organization events
    OrganizationCreate = "organization-create",
    OrganizationUpdate = "organization-update",
    OrganizationDelete = "organization-delete",

    // Health system events
    HealthSystemCreate = "health-system-create",
    HealthSystemUpdate = "health-system-update",
    HealthSystemDelete = "health-system-delete",

    // Hospital events
    HospitalCreate = "hospital-create",
    HospitalUpdate = "hospital-update",
    HospitalDelete = "hospital-delete",

    // Marketing events
    MarketingCampaignCreate = "marketing-campaign-create",
    MarketingCampaignUpdate = "marketing-campaign-update",
    MarketingCampaignDelete = "marketing-campaign-delete",
    MarketingCampaignStart = "marketing-campaign-start",
    MarketingCampaignEnd = "marketing-campaign-end",
    MarketingCampaignPause = "marketing-campaign-pause",
    MarketingCampaignResume = "marketing-campaign-resume",

    // Educational events
    EducationalContentCreate = "educational-content-create",
    EducationalContentUpdate = "educational-content-update",
    EducationalContentDelete = "educational-content-delete",
    EducationalContentPublish = "educational-content-publish",
    EducationalContentSearch = "educational-content-search",

    EducationalCourseStart = "educational-course-start",
    EducationalCourseComplete = "educational-course-complete",
    EducationalCourseCancel = "educational-course-cancel",

    EducationalVideoStart = "educational-video-start",
    EducationalVideoComplete = "educational-video-complete",
    EducationalVideoCancel = "educational-video-cancel",

    // Diagnosis events
    DiagnosisCreate = "diagnosis-create",
    DiagnosisUpdate = "diagnosis-update",
    DiagnosisDelete = "diagnosis-delete",

    // Doctor Note events
    DoctorNoteCreate = "doctor-note-create",
    DoctorNoteUpdate = "doctor-note-update",
    DoctorNoteDelete = "doctor-note-delete",

    // Allergy events
    AllergyCreate = "allergy-create",
    AllergyUpdate = "allergy-update",
    AllergyDelete = "allergy-delete",

    // Immunization events
    ImmunizationCreate = "immunization-create",
    ImmunizationUpdate = "immunization-update",
    ImmunizationDelete = "immunization-delete",

    // Procedure events
    ProcedureCreate = "procedure-create",
    ProcedureUpdate = "procedure-update",
    ProcedureDelete = "procedure-delete",

    // Medical Condition events
    MedicalConditionCreate = "medical-condition-create",
    MedicalConditionUpdate = "medical-condition-update",
    MedicalConditionDelete = "medical-condition-delete",

    // Complaint events
    ComplaintCreate = "complaint-create",
    ComplaintUpdate = "complaint-update",
    ComplaintDelete = "complaint-delete",

    // Observation events
    ObservationCreate = "observation-create",
    ObservationUpdate = "observation-update",
    ObservationDelete = "observation-delete",

    // Encounter events
    EncounterCreate = "encounter-create",
    EncounterUpdate = "encounter-update",
    EncounterDelete = "encounter-delete",

}

export enum AnalyticsEventSubject {
    UserAccount = "user-account",
    LoginSession = "login-session",
    Medication = "medication",
    MedicationSchedule = "medication-schedule",
    UserTask = "user-task",
    CareplanEnrollment = "careplan-enrollment",
}
