import { HealthReportSettingsDto } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.dto';
import { HealthReportSettingsDomainModel } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';

export interface IHealthReportSettingsRepo {

    createReportSettings (model: HealthReportSettingsDomainModel): Promise<HealthReportSettingsDto>;

    getReportSettingsByUserId(userId: string): Promise<HealthReportSettingsDto>;

    updateReportSettingsByUserId (userId: string, updateModel: HealthReportSettingsDomainModel)
        : Promise<HealthReportSettingsDto>;

}
