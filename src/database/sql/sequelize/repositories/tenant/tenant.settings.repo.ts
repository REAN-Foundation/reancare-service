import TenantSettings from '../../models/tenant/tenant.settings.model';
import { 
    HealthcareInterfaces, 
    CommonSettings, 
    PatientAppSettings, 
    ChatBotSettings, 
    FormsSettings, 
    TenantSettingsDomainModel, 
    TenantSettingsDto 
} from "../../../../../domain.types/tenant/tenant.settings.types";
import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { ITenantSettingsRepo } from '../../../../repository.interfaces/tenant/tenant.settings.interface';
import { TenantSettingsMapper } from '../../mappers/tenant/tenant.settings.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';

///////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsRepo implements ITenantSettingsRepo {

    createDefaultSettings = async (tenantId: uuid, model: TenantSettingsDomainModel)
        : Promise<TenantSettingsDto> => {
        try {
            const entity = {
                TenantId            : tenantId,
                HealthcareInterfaces: JSON.stringify(model.HealthcareInterfaces),
                Common              : JSON.stringify(model.Common),
                PatientApp          : JSON.stringify(model.PatientApp),
                ChatBot             : JSON.stringify(model.ChatBot),
                Forms               : JSON.stringify(model.Forms),
            };
            const settings = await TenantSettings.create(entity);
            return TenantSettingsMapper.toDto(settings);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to create tenant feature settings: ${error.message}`);
        }
    };

    getTenantSettings = async (tenantId: string): Promise<TenantSettingsDto> => {
        try {
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            return TenantSettingsMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to get tenant feature settings: ${error.message}`);
        }
    };

    updateHealthcareInterfaces = async (tenantId: string, settings: HealthcareInterfaces)
        : Promise<TenantSettingsDto> => {
        try {
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.HealthcareInterfaces = JSON.stringify(settings);
            await record.save();
            return TenantSettingsMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant feature settings: ${error.message}`);
        }
    };

    updateCommonSettings = async (tenantId: string, settings: CommonSettings)
        : Promise<TenantSettingsDto> => {
        try {
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.Common = JSON.stringify(settings);
            await record.save();
            return TenantSettingsMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant feature settings: ${error.message}`);
        }
    };

    updatePatientAppSettings = async (tenantId: string, settings: PatientAppSettings)
        : Promise<TenantSettingsDto> => {
        try {
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.PatientApp = JSON.stringify(settings);
            await record.save();
            return TenantSettingsMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant feature settings: ${error.message}`);
        }
    };

    updateChatBotSettings = async (tenantId: string, settings: ChatBotSettings): Promise<TenantSettingsDto> => {
        try {
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.ChatBot = JSON.stringify(settings);
            await record.save();
            return TenantSettingsMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant feature settings: ${error.message}`);
        }
    };

    updateFormsSettings = async (tenantId: string, settings: FormsSettings): Promise<TenantSettingsDto> => {
        try {
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.Forms = JSON.stringify(settings);
            await record.save();
            return TenantSettingsMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant feature settings: ${error.message}`);
        }
    };
    
}
