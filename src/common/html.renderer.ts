
import puppeteer from 'puppeteer';
import { DateStringFormat } from '../domain.types/miscellaneous/time.types';
import { TimeHelper } from './time.helper';
import { ConfigurationManager } from '../config/configuration.manager';
import path from 'path';
import fs from 'fs';
import { Logger } from './logger';
import { Helper } from './helper';
import { OSType } from '../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////

export const htmlTextToPNG = async (htmlText: string, width: number, height: number, filename?: string) => {
    try {
        const generatedFilePath = await getGeneratedFilePath(filename);

        const puppeteerArgs = {
            args            : ['--no-sandbox'],
            defaultViewport : {
                width             : width,
                height            : height,
                deviceScaleFactor : 1
            },
            executablePath : '/usr/bin/chromium-browser'
        };
        const osType = Helper.getOSType();
        if (osType === OSType.Windows) {
            delete puppeteerArgs.executablePath;
        } else if (osType === OSType.MacOS) {
            puppeteerArgs.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        }

        const browser = await puppeteer.launch(puppeteerArgs);
        const page = await browser.newPage();

        await page.setContent(htmlText, { waitUntil: 'networkidle0' });

        await page.screenshot({
            path: generatedFilePath,
            type: 'png',
            fullPage: true
        });

        await browser.close();

        Logger.instance().log('Image file created');
        return generatedFilePath;
    }
    catch (error) {
        Logger.instance().log(`HTML Error: ${error.message}`);
    }
};

export const htmlTextToPDFBuffer = async (htmlText: string): Promise<Buffer> => {

    const browser = await puppeteer.launch({ args: ['--no-sandbox'], executablePath: '/usr/bin/chromium-browser' });
    const page = await browser.newPage();

    await page.setContent(htmlText);

    const pdfData = await page.pdf();
    const pdfBuffer = Buffer.from(pdfData);

    await page.close();
    await browser.close();

    return pdfBuffer;
};

async function getGeneratedFilePath(filename: string, extension = '.png'): Promise<string> {
    const uploadFolder = ConfigurationManager.UploadTemporaryFolder();
    var dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
    var fileFolder = path.join(uploadFolder, dateFolder);
    await fs.promises.mkdir(fileFolder, { recursive: true });
    const timestamp = TimeHelper.timestamp(new Date());
    if (!filename) {
        filename = timestamp + extension;
    }
    const absFilepath = path.join(fileFolder, filename);
    return absFilepath;
}
