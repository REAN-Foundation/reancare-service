import HealthReportSetting from '../../../models/users/patient/health.report.setting.model';
import { HealthReportSettingsDto } from '../../../../../../domain.types/users/patient/health.report.setting/health.report.setting.dto';

///////////////////////////////////////////////////////////////////////////////////

export class HealthReportSettingMapper {

    static toDto = (healthReportSetting: HealthReportSetting): HealthReportSettingsDto => {

        if (healthReportSetting == null){
            return null;
        }

        const dto: HealthReportSettingsDto = {
            id            : healthReportSetting.id,
            PatientUserId : healthReportSetting.PatientUserId,
            Preference    : JSON.parse(healthReportSetting.Preference),

        };

        return dto;
    };

}
