import { Settings } from "./health.report.setting.domain.model";

export interface HealthReportSettingDto {
    id?: string;
    PatientUserId?: string;
    Preference?: Settings;
}
