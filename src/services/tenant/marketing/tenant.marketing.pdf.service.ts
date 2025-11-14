import 'reflect-metadata';
import { injectable } from 'tsyringe';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { htmlTextToPDFBuffer } from '../../../common/html.renderer';
import { PDFGenerator } from '../../../modules/reports/pdf.generator';
import { TenantSettingsMarketingDto } from '../../../domain.types/tenant/marketing/tenant.settings.marketing.types';
import { FileResourceService } from '../../general/file.resource.service';
import { Injector } from '../../../startup/injector';
import { Logger } from '../../../common/logger';

const DEFAULT_STYLING = {
    Primary              : '#1a472a',
    Secondary            : '#2d5f3f',
    Accent               : '#25D366',
    LightBg              : '#f1f8f4',
    Panel                : '#ffffff',
    Muted                : '#555',
    Text                 : '#222',
    HeadingFont          : "'Poppins', sans-serif",
    BodyFont             : "'Inter', sans-serif",
    PageWidth            : '210mm',
    PageHeight           : '297mm',
    UserInterfaceWidth   : '260px',
    UserInteractionWidth : '250px',
    QrSize               : '120px',
};

const DEFAULT_CONTENT = {
    Header : {
        MainTitle : 'Your Health Program Name',
        Subtitle  : 'Your Personalized Companion for Health and Wellness',
    },
    Introduction : {
        IntroParagraph   : 'Welcome to our health program. This comprehensive platform provides you with personalized support, guidance, and resources to help you achieve your health goals.',
        ProblemStatement : 'Many individuals struggle with managing their health effectively due to lack of personalized guidance, difficulty tracking progress, and limited access to timely support. Our program addresses these challenges by providing a structured, easy-to-use platform that puts your health journey at your fingertips.',
    },
    Benefits : {
        Title : 'Key Benefits',
        Items : [
            'Access personalized health recommendations and care plans',
            'Track your health metrics and progress over time',
            'Receive timely reminders and health tips',
            'Connect with healthcare professionals when needed',
            'Access educational resources tailored to your needs',
        ],
    },
    UserInterface : {
        Heading   : 'Who Can Benefit from This Program',
        Paragraph : 'This program is designed for individuals seeking to take control of their health journey. Whether you are managing a chronic condition, working on preventive care, or simply looking to improve your overall wellness, our platform provides personalized support to meet your unique needs.',
    },
    Footer : {
        CtaHeading     : 'Get Started Today',
        CtaDescription : 'Register by scanning the QR code or contacting us through your preferred channel. Join our community and take the first step towards better health.',
        QrInstruction  : 'Scan to get started',
    },
};

interface PamphletTemplateModel {
    styling: typeof DEFAULT_STYLING;
    content: typeof DEFAULT_CONTENT;
    images: {
        PartnerLogos: string[];
        TitleImage?: string;
        UserInterfaceImage?: string;
        QRCode?: string;
    };
}

@injectable()
export class TenantMarketingPdfService {

    private _template: HandlebarsTemplateDelegate = null;

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

        const templatePath = path.join(process.cwd(), 'assets', 'pdf.templates', 'tenant.marketing.pamphlet.hbs');
        if (!fs.existsSync(templatePath)) {
            throw new Error(`PDF template tenant.marketing.pamphlet.hbs not found at ${templatePath}`);
        }

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
            Header : {
                ...DEFAULT_CONTENT.Header,
                ...(settings?.Content?.Header ?? {}),
            },
            Introduction : {
                ...DEFAULT_CONTENT.Introduction,
                ...(settings?.Content?.Introduction ?? {}),
            },
            Benefits : {
                ...DEFAULT_CONTENT.Benefits,
                ...(settings?.Content?.Benefits ?? {}),
                Items : settings?.Content?.Benefits?.Items?.length > 0
                    ? settings.Content.Benefits.Items
                    : DEFAULT_CONTENT.Benefits.Items,
            },
            UserInterface : {
                ...DEFAULT_CONTENT.UserInterface,
                ...(settings?.Content?.UserInterface ?? {}),
            },
            Footer : {
                ...DEFAULT_CONTENT.Footer,
                ...(settings?.Content?.Footer ?? {}),
            },
        };

        const imagesInput = settings?.Images ?? {};
        const logosInput = settings?.Logos ?? {};

        const partnerLogosIds = Array.isArray(logosInput)
            ? logosInput
            : (typeof logosInput === 'object' && logosInput?.PartnerLogos)
                ? (Array.isArray(logosInput.PartnerLogos) ? logosInput.PartnerLogos : [logosInput.PartnerLogos])
                : [];
        const partnerLogos = await Promise.all(partnerLogosIds.map(id => this.downloadResourceToDataUrl(id)));

        const titleImage = typeof imagesInput?.TitleImage === 'string'
            ? await this.downloadResourceToDataUrl(imagesInput.TitleImage)
            : undefined;
        const userInterfaceImage = typeof imagesInput?.UserInterfaceImage === 'string'
            ? await this.downloadResourceToDataUrl(imagesInput.UserInterfaceImage)
            : undefined;

        const qrSource = settings?.QRCode;
        const qrCodeId = typeof qrSource === 'string'
            ? qrSource
            : qrSource?.ResourceId;
        const qrCode = qrCodeId ? await this.downloadResourceToDataUrl(qrCodeId) : undefined;

        const images = {
            'PartnerLogos'       : partnerLogos.filter(url => url !== null),
            'TitleImage'         : titleImage,
            'UserInterfaceImage' : userInterfaceImage,
            'QRCode'             : qrCode,
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
        const ext = filePath.split('.').pop()
            ?.toLowerCase();
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
