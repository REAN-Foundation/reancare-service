import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { htmlTextToPDFBuffer } from '../../common/html.renderer';
import { PDFGenerator } from '../reports/pdf.generator';
import { TenantSettingsMarketingDto } from '../../domain.types/tenant/marketing/tenant.settings.marketing.types';
import { ConfigurationManager } from '../../config/configuration.manager';
import { FileResourceService } from '../../services/general/file.resource.service';
import { Injector } from '../../startup/injector';
import { Logger } from '../../common/logger';

const DEFAULT_STYLING = {
    primary              : '#1a472a',
    secondary            : '#2d5f3f',
    accent               : '#25D366',
    lightBg              : '#f1f8f4',
    panel                : '#ffffff',
    muted                : '#555',
    text                 : '#222',
    headingFont          : "'Poppins', sans-serif",
    bodyFont             : "'Inter', sans-serif",
    pageWidth            : '210mm',
    pageHeight           : '297mm',
    userInterfaceWidth   : '260px',
    userInteractionWidth : '250px',
    qrSize               : '120px',
};

const DEFAULT_CONTENT = {
    header : {
        mainTitle : 'Your Health Program Name',
        subtitle  : 'Your Personalized Companion for Health and Wellness',
    },
    introduction : {
        introParagraph   : 'Welcome to our health program. This comprehensive platform provides you with personalized support, guidance, and resources to help you achieve your health goals.',
        problemStatement : 'Many individuals struggle with managing their health effectively due to lack of personalized guidance, difficulty tracking progress, and limited access to timely support. Our program addresses these challenges by providing a structured, easy-to-use platform that puts your health journey at your fingertips.',
    },
    benefits : {
        title : 'Key Benefits',
        items : [
            'Access personalized health recommendations and care plans',
            'Track your health metrics and progress over time',
            'Receive timely reminders and health tips',
            'Connect with healthcare professionals when needed',
            'Access educational resources tailored to your needs',
        ],
    },
    userInterface : {
        heading   : 'Who Can Benefit from This Program',
        paragraph : 'This program is designed for individuals seeking to take control of their health journey. Whether you are managing a chronic condition, working on preventive care, or simply looking to improve your overall wellness, our platform provides personalized support to meet your unique needs.',
    },
    footer : {
        ctaHeading     : 'Get Started Today',
        ctaDescription : 'Register by scanning the QR code or contacting us through your preferred channel. Join our community and take the first step towards better health.',
        qrInstruction  : 'Scan to get started',
    },
};

interface PamphletTemplateModel {
    styling: Record<string, any>;
    content: typeof DEFAULT_CONTENT;
    images: {
        partnerLogos: string[];
        titleImage?: string;
        userInterfaceImage?: string;
        qrCode?: string;
    };
}

@injectable()
export class TenantMarketingPdfService {

    private _template: HandlebarsTemplateDelegate = null;

    constructor() {}

    public async generatePamphletBuffer(settings: TenantSettingsMarketingDto): Promise<Buffer> {
        const html = await this.renderPamphletHtml(settings);
        return await htmlTextToPDFBuffer(html);
    }

    public async generatePamphletFile(
        settings: TenantSettingsMarketingDto,
        filePrefix: string
    ): Promise<{ absFilepath: string; filename: string; }> {
        const html = await this.renderPamphletHtml(settings);
        const buffer = await htmlTextToPDFBuffer(html);
        
        const { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath(filePrefix);
        await fs.promises.writeFile(absFilepath, buffer as Uint8Array);
        
        return { absFilepath, filename };
    }

    private async renderPamphletHtml(settings: TenantSettingsMarketingDto): Promise<string> {
        const template = await this.getTemplate();
        const model = await this.mapSettingsToTemplateModel(settings);
        const html = template(model);
        
        return html;
    }

    private async getTemplate(): Promise<HandlebarsTemplateDelegate> {
        if (this._template) {
            return this._template;
        }

        const templatePath = path.join(__dirname, 'templates', 'tenant.marketing.pamphlet.hbs');
        const templateSource = await fs.promises.readFile(templatePath, { encoding: 'utf8' });
        this._template = Handlebars.compile(templateSource);
        return this._template;
    }

    private async mapSettingsToTemplateModel(settings: TenantSettingsMarketingDto): Promise<PamphletTemplateModel> {
        const styling = {
            ...DEFAULT_STYLING,
            ...(settings?.Styling ?? {}),
        };

        const content = {
            header : {
                ...DEFAULT_CONTENT.header,
                ...(settings?.Content?.header ?? {}),
            },
            introduction : {
                ...DEFAULT_CONTENT.introduction,
                ...(settings?.Content?.introduction ?? {}),
            },
            benefits : {
                ...DEFAULT_CONTENT.benefits,
                ...(settings?.Content?.benefits ?? {}),
                items : settings?.Content?.benefits?.items?.length > 0
                    ? settings.Content.benefits.items
                    : DEFAULT_CONTENT.benefits.items,
            },
            userInterface : {
                ...DEFAULT_CONTENT.userInterface,
                ...(settings?.Content?.userInterface ?? {}),
            },
            footer : {
                ...DEFAULT_CONTENT.footer,
                ...(settings?.Content?.footer ?? {}),
            },
        };

        const imagesInput = settings?.Images ?? {};
        const logosInput = settings?.Logos ?? {};

        const partnerLogosIds = Array.isArray(logosInput)
            ? logosInput
            : (typeof logosInput === 'object' && logosInput?.partnerLogos)
                ? (Array.isArray(logosInput.partnerLogos) ? logosInput.partnerLogos : [logosInput.partnerLogos])
                : [];
        const partnerLogos = await Promise.all(partnerLogosIds.map(id => this.downloadResourceToDataUrl(id)));

        const titleImage = typeof imagesInput?.titleImage === 'string' 
            ? await this.downloadResourceToDataUrl(imagesInput.titleImage) 
            : undefined;
        const userInterfaceImage = typeof imagesInput?.userInterfaceImage === 'string'
            ? await this.downloadResourceToDataUrl(imagesInput.userInterfaceImage)
            : undefined;

        const qrCodeId = typeof settings?.QRcode === 'string'
            ? settings.QRcode
            : settings?.QRcode?.resourceId;
        const qrCode = qrCodeId ? await this.downloadResourceToDataUrl(qrCodeId) : undefined;

        const images = {
            partnerLogos : partnerLogos.filter(url => url !== null),
            titleImage,
            userInterfaceImage,
            qrCode,
        };

        return {
            styling,
            content,
            images,
        };
    }

    private async downloadResourceToDataUrl(resourceId: string): Promise<string | null> {
        if (!resourceId || resourceId.trim().length === 0) {
            return null;
        }

        try {
            const fileResourceService = Injector.Container.resolve(FileResourceService);
            const localPath = await fileResourceService.downloadById(resourceId);
            
            if (!localPath || !fs.existsSync(localPath)) {
                return null;
            }

            const fileBuffer = await fs.promises.readFile(localPath);
            const base64 = fileBuffer.toString('base64');
            const mimeType = this.getMimeType(localPath);
            const dataUrl = `data:${mimeType};base64,${base64}`;

            try {
                await fs.promises.unlink(localPath);
            } catch (err) { /* empty */ }

            return dataUrl;
        }
        catch (error) {
            Logger.instance().log(`Error downloading resource ${resourceId}: ${error.message}`);
            return null;
        }
    }

    private getMimeType(filePath: string): string {
        const ext = filePath.split('.').pop()?.toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            'jpg'  : 'image/jpeg',
            'jpeg' : 'image/jpeg',
            'png'  : 'image/png',
            'gif'  : 'image/gif',
            'webp' : 'image/webp',
            'svg'  : 'image/svg+xml',
            'bmp'  : 'image/bmp',
        };
        return mimeTypes[ext] || 'image/jpeg';
    }
}


