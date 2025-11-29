import TenantSettingsMarketing from '../../../models/tenant/marketing/tenant.settings.marketing.model';
import { TenantSettingsMarketingDomainModel, TenantSettingsMarketingDto } from "../../../../../../domain.types/tenant/marketing/tenant.settings.marketing.types";
import { uuid } from "../../../../../../domain.types/miscellaneous/system.types";
import { ITenantSettingsMarketingRepo } from '../../../../../repository.interfaces/tenant/marketing/tenant.settings.marketing.interface';
import { TenantSettingsMarketingMapper } from '../../../mappers/tenant/marketing/tenant.settings.marketing.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { Helper } from '../../../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingRepo implements ITenantSettingsMarketingRepo {

    createDefaultSettings = async (tenantId: uuid, model: TenantSettingsMarketingDomainModel)
        : Promise<TenantSettingsMarketingDto> => {
        try {
            const styling = model.Styling ? this.validateJSONStringify(JSON.stringify(model.Styling)) : null;
            const content = model.Content ? this.validateJSONStringify(JSON.stringify(model.Content)) : null;
            const qrCode  = model.QRCode ? this.validateJSONStringify(JSON.stringify(model.QRCode)) : null;
            const images  = model.Images ? this.validateJSONStringify(JSON.stringify(model.Images)) : null;
            const logos   = model.Logos ? this.validateJSONStringify(JSON.stringify(model.Logos)) : null;

            const entity = {
                TenantId : tenantId,
                Styling  : styling,
                Content  : content,
                QRcode   : qrCode,
                Images   : images,
                Logos    : logos,
            } as any;
            const settings = await TenantSettingsMarketing.create(entity);
            return TenantSettingsMarketingMapper.toDto(settings);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to create tenant marketing settings: ${error.message}`);
        }
    };

    getSettings = async (tenantId: string): Promise<TenantSettingsMarketingDto> => {
        try {
            const record = await TenantSettingsMarketing.findOne({ where: { TenantId: tenantId } });
            return TenantSettingsMarketingMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to get tenant marketing settings: ${error.message}`);
        }
    };

    updateStyling = async (tenantId: string, settings: any): Promise<TenantSettingsMarketingDto> => {
        try {
            const styling = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettingsMarketing.findOne({ where: { TenantId: tenantId } });
            record.Styling = styling;
            await record.save();
            return TenantSettingsMarketingMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant marketing styling: ${error.message}`);
        }
    };

    updateContent = async (tenantId: string, settings: any): Promise<TenantSettingsMarketingDto> => {
        try {
            const content = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettingsMarketing.findOne({ where: { TenantId: tenantId } });
            record.Content = content;
            await record.save();
            return TenantSettingsMarketingMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant marketing content: ${error.message}`);
        }
    };

    updateQRCode = async (tenantId: string, settings: any): Promise<TenantSettingsMarketingDto> => {
        try {
            const qrCode = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettingsMarketing.findOne({ where: { TenantId: tenantId } });
            record.QRcode = qrCode;
            await record.save();
            return TenantSettingsMarketingMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant marketing qrcode: ${error.message}`);
        }
    };

    updateImages = async (tenantId: string, settings: any): Promise<TenantSettingsMarketingDto> => {
        try {
            const images = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettingsMarketing.findOne({ where: { TenantId: tenantId } });
            record.Images = images;
            await record.save();
            return TenantSettingsMarketingMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant marketing images: ${error.message}`);
        }
    };

    updateLogos = async (tenantId: string, settings: any): Promise<TenantSettingsMarketingDto> => {
        try {
            const logos = this.validateJSONStringify(JSON.stringify(settings));
            const record = await TenantSettingsMarketing.findOne({ where: { TenantId: tenantId } });
            record.Logos = logos;
            await record.save();
            return TenantSettingsMarketingMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant marketing logos: ${error.message}`);
        }
    };

    updatePDFResourceId = async (tenantId: string, resourceId: string): Promise<TenantSettingsMarketingDto> => {
        try {
            const record = await TenantSettingsMarketing.findOne({ where: { TenantId: tenantId } });
            record.PDFResourceId = resourceId;
            await record.save();
            return TenantSettingsMarketingMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to update tenant marketing PDF resource id: ${error.message}`);
        }
    };

    private readonly validateJSONStringify = (str: string) => {
        const validateTrue = Helper.replaceAll(str,`"true"`, 'true');
        const validatedString = Helper.replaceAll(validateTrue, `"false"`, 'false');
        return validatedString;
    };

    delete = async (tenantId: string): Promise<boolean> => {
        try {
            const record = await TenantSettingsMarketing.findOne({ where: { TenantId: tenantId } });
            if (!record) {
                return false;
            }
            await record.destroy();
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to delete tenant marketing settings: ${error.message}`);
        }
    };

}

