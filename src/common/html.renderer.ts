
import puppeteer from 'puppeteer';
import { DateStringFormat } from '../domain.types/miscellaneous/time.types';
import { TimeHelper } from './time.helper';

export const htmlTextToPNG = async (htmlText: string, width: number, height: number, filename?: string) => {

    const browser: puppeteer.Browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width  : width,
        height : height,
      
    });
    //await page.goto('file:///F:/service-1/index.html');
    await page.setContent(htmlText);
   
    const generatedFilePath = getGeneratedFilePath(filename);
    await page.screenshot({
        path     : generatedFilePath,
        fullPage : false,
    });
    await browser.close();

    return generatedFilePath;
};
  
export const htmlTextToPDFBuffer = async (htmlText: string): Promise<Buffer> => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlText);
    const pdfBuffer = await page.pdf();

    await page.close();
    await browser.close();

    return pdfBuffer;
};

function getGeneratedFilePath(filename: string, extension = '.png'): string {
    const timestampFile = TimeHelper.timestamp(new Date()) + extension;
    var dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
    var filePath = 'resources/' + dateFolder + '/' + filename ?? timestampFile;
    return filePath;
}
