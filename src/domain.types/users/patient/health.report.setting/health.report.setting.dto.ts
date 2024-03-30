import { Settings } from "./health.report.setting.domain.model";

export interface HealthReportSettingsDto {
    id?: string;
    PatientUserId?: string;
    Preference?: Settings;
}
