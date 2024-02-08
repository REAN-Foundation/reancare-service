import TenantSettings from '../../models/tenant/tenant.settings.model';
import {
    UserInterfaces,
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
import { Helper } from '../../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsRepo implements ITenantSettingsRepo {

    createDefaultSettings = async (tenantId: uuid, model: TenantSettingsDomainModel)
        : Promise<TenantSettingsDto> => {
        try {
            const userInterface: string = this.validateJSONStringify(JSON.stringify(model.UserInterfaces));
            const common = this.validateJSONStringify(JSON.stringify(model.Common));
            const patientApp = this.validateJSONStringify(JSON.stringify(model.PatientApp));
            const chatBot = this.validateJSONStringify(JSON.stringify(model.ChatBot));
            const forms = this.validateJSONStringify(JSON.stringify(model.Forms));
            
            const entity = {
                TenantId       : tenantId,
                UserInterfaces : userInterface,
                Common         : common,
                PatientApp     : patientApp,
                ChatBot        : chatBot,
                Forms          : forms,
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

    updateHealthcareInterfaces = async (tenantId: string, settings: UserInterfaces)
        : Promise<TenantSettingsDto> => {
        try {
            const userInterface: string = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.UserInterfaces = userInterface;
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
            const common = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.Common = common;
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
            const patientApp = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.PatientApp = patientApp;
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
            const chatBot = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.ChatBot = chatBot;
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
            const forms = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettings.findOne({ where: { TenantId: tenantId } });
            record.Forms = forms;
            await record.save();
            return TenantSettingsMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant feature settings: ${error.message}`);
        }
    };

    private validateJSONStringify = (str: string) => {
        const validateTrue = Helper.replaceAll(str,`"true"`, 'true');
        const validatedString = Helper.replaceAll(validateTrue, `"false"`, 'false');
        return validatedString;
    };
    
}
