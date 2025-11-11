import puppeteer from 'puppeteer';
import { DateStringFormat } from '../domain.types/miscellaneous/time.types';
import { TimeHelper } from './time.helper';
import { ConfigurationManager } from '../config/configuration.manager';
import path from 'path';
import fs from 'fs';
import { Logger } from './logger';
import { Helper } from './helper';
import { OSType } from '../domain.types/miscellaneous/system.types';
import nodeHtmlToImage from 'node-html-to-image';

////////////////////////////////////////////////////////////////////////////////////

export const htmlTextToPNG = async (htmlText: string, width: number, height: number, filename?: string) => {
    try {
        const generatedFilePath = await getGeneratedFilePath(filename);

        return new Promise<string>( (resolve, reject) => {
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

            nodeHtmlToImage({
                output        : generatedFilePath,
                html          : htmlText,
                puppeteerArgs : puppeteerArgs
            }).then(() => {
                Logger.instance().log('Imgae file created');
                resolve(generatedFilePath);
            // eslint-disable-next-line newline-per-chained-call
            }).catch(async (error) => {
                Logger.instance().log(`Error creating image file: ${error.message}`);
                reject(null);
            });
        });
    }
    catch (error) {
        Logger.instance().log(`HTML Error: ${error.message}`);
    }
};

export const htmlTextToPDFBuffer = async (htmlText: string): Promise<Buffer> => {

    const launchOptions: any = {
        args : [
            '--no-sandbox',
            '--disable-dev-shm-usage'
        ]
    };

    const osType = Helper.getOSType();
    if (osType === OSType.Linux) {
        launchOptions.executablePath = '/usr/bin/chromium-browser';
    } else if (osType === OSType.MacOS) {
        launchOptions.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
    // On Windows, puppeteer auto-detects Chrome, so no executablePath needed

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setContent(htmlText, { waitUntil: 'load' });
    
    // Wait for all images to load
    await page.evaluate(() => {
        const images = Array.from(document.images);
        
        return Promise.all(
            images.map((img) => {
                return new Promise<boolean>((resolve) => {
                    if (img.complete && img.naturalHeight !== 0) {
                        resolve(true);
                        return;
                    }
                    
                    img.addEventListener('load', () => resolve(true));
                    img.addEventListener('error', () => resolve(false));
                    
                    // Timeout after 5 seconds per image
                    setTimeout(() => resolve(false), 5000);
                });
            })
        );
    });

    const pdfBuffer = await page.pdf({
        format          : 'A4',
        printBackground : true,
    });

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
