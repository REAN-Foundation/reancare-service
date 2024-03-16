import { HealthReportSettingsDto } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.dto';
import { HealthReportSettingsDomainModel } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';

export interface IHealthReportSettingsRepo {

    create(entity: HealthReportSettingsDomainModel): Promise<HealthReportSettingsDto>;

    getByUserId(userId: string): Promise<HealthReportSettingsDto>;

    updateByUserId(userId: string, updateModel: HealthReportSettingsDomainModel): Promise<HealthReportSettingsDto>;

}
