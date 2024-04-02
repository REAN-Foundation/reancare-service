import { HealthReportSettingsDomainModel } from '../../../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import HealthReportSetting from '../../../models/users/patient/health.report.setting.model';
import { HealthReportSettingMapper } from '../../../mappers/users/patient/health.report.setting.mapper';
import { IHealthReportSettingsRepo } from '../../../../../../database/repository.interfaces/users/patient/health.report.setting.repo.interface';
import { HealthReportSettingsDto } from '../../../../../../domain.types/users/patient/health.report.setting/health.report.setting.dto';

///////////////////////////////////////////////////////////////////////

export class HealthReportSettingsRepo implements IHealthReportSettingsRepo {

    createReportSettings = async (model: HealthReportSettingsDomainModel)
    : Promise<HealthReportSettingsDto> => {
        try {
            const entity = {
                PatientUserId : model.PatientUserId,
                Preference    : JSON.stringify(model.Preference)
            };
            const healthReportSettings = await HealthReportSetting.create(entity);
            return HealthReportSettingMapper.toDto(healthReportSettings);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getReportSettingsByUserId = async (patientUserId: string): Promise<HealthReportSettingsDto> => {
        try {
            const healthReportSettings = await HealthReportSetting.findOne({
                where : {
                    PatientUserId : patientUserId
                }
            });
            return HealthReportSettingMapper.toDto(healthReportSettings);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateReportSettingsByUserId = async (patientUserId: string, model: HealthReportSettingsDomainModel)
        : Promise<HealthReportSettingsDto> => {
        try {
            const healthReportSettings = await HealthReportSetting.findOne({
                where : {
                    PatientUserId : patientUserId
                }
            });
            if (healthReportSettings == null) {
                throw new Error("Cannot find health report settings for the patient.");
            }
            
            healthReportSettings.Preference = JSON.stringify(model.Preference);
            await healthReportSettings.save();

            return HealthReportSettingMapper.toDto(healthReportSettings);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
