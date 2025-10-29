import { AhaNumbersRepoInterface } from '../../../database/repository.interfaces/statistics/aha.numbers.repo.interface';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';
import { TimeHelper } from '../../../common/time.helper';
import { DateStringFormat } from '../../../domain.types/miscellaneous/time.types';
import { injectable, inject } from 'tsyringe';
import * as asyncLib from 'async';
import { Logger } from '../../../common/logger';
import { IFileStorageService } from '../../../modules/storage/interfaces/file.storage.service.interface';
import { ConfigurationManager } from '../../../config/configuration.manager';
import AdmZip from 'adm-zip';

const ASYNC_TASK_COUNT = 1;

@injectable()
export class AhaNumbersService {

    constructor(
        @inject('IAhaNumbersRepo') private readonly _ahaNumbersRepo: AhaNumbersRepoInterface,
        @inject('IFileStorageService') private readonly _storageService: IFileStorageService
    ) {}

    public _q = asyncLib.queue((onCompleted) => {
        (async () => {
            try {
                await this.generateAllCsvFiles();
                onCompleted();
            } catch (error) {
                onCompleted(error);
            }
        })();
    }, ASYNC_TASK_COUNT);

    public enqueueGenerateCsv = async (): Promise<void> => {
        try {
            this.enqueue();
        } catch (error) {
            Logger.instance().log(`Error enqueueing CSV generation: ${JSON.stringify(error.message, null, 2)}`);
        }
    };

    private enqueue = (): void => {
        this._q.push((error) => {
            if (error) {
                Logger.instance().log(`Error generating CSV files: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error stack: ${JSON.stringify(error.stack, null, 2)}`);
            } else {
                Logger.instance().log(`All 11 CSV files generated successfully!`);
            }
        });
    };

    private generateAllCsvFiles = async (): Promise<void> => {
        try {
            
            await this.generateCholesterolActiveCsv();
            await this.generateCholesterolDeletedCsv();
            await this.generateStrokeActiveCsv();
            await this.generateStrokeDeletedCsv();
            await this.generateWellstarCholesterolCsv();
            await this.generateUCSanDiegoCholesterolCsv();
            await this.generateMHealthFairviewCholesterolCsv();
            await this.generateAtriumHealthCholesterolCsv();
            await this.generateKaiserPermanenteCholesterolCsv();
            await this.generateNebraskaHealthSystemCholesterolCsv();
            await this.generateHCAHealthcareCholesterolCsv();
            
        } catch (error) {
            Logger.instance().log(`Error in CSV generation: ${JSON.stringify(error.message, null, 2)}`);
            throw error;
        }
    };

    private async generateCholesterolActiveCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const cholesterolActive = await this._ahaNumbersRepo.getCholesterolActive();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `Cholesterol_Real_Active.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, cholesterolActive, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'DeletedAt', title: 'Deleted At' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'CreatedAt', title: 'Created At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateCholesterolDeletedCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const cholesterolDeleted = await this._ahaNumbersRepo.getCholesterolDeleted();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `Cholesterol_Real_Deleted.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, cholesterolDeleted, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'DeletedAt', title: 'Deleted At' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'CreatedAt', title: 'Created At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateStrokeActiveCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const strokeActive = await this._ahaNumbersRepo.getStrokeActive();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `Stroke_Real_Active.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, strokeActive, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'DeletedAt', title: 'Deleted At' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'CreatedAt', title: 'Created At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateStrokeDeletedCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const strokeDeleted = await this._ahaNumbersRepo.getStrokeDeleted();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `Stroke_Real_Deleted.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, strokeDeleted, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'DeletedAt', title: 'Deleted At' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'CreatedAt', title: 'Created At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateWellstarCholesterolCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const wellstarData = await this._ahaNumbersRepo.getWellstarCholesterol();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `Wellstar_Health_System_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, wellstarData, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'Plancode', title: 'Plan Code' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'HealthSystem', title: 'Health System' },
            { id: 'AssociatedHospital', title: 'Associated Hospital' },
            { id: 'DeletedAt', title: 'Deleted At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateUCSanDiegoCholesterolCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const ucSanDiegoData = await this._ahaNumbersRepo.getUCSanDiegoCholesterol();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `UC_San_Diego_Health_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, ucSanDiegoData, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'Plancode', title: 'Plan Code' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'HealthSystem', title: 'Health System' },
            { id: 'AssociatedHospital', title: 'Associated Hospital' },
            { id: 'DeletedAt', title: 'Deleted At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateMHealthFairviewCholesterolCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const mHealthFairviewData = await this._ahaNumbersRepo.getMHealthFairviewCholesterol();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `M_Health_Fairview_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, mHealthFairviewData, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'Plancode', title: 'Plan Code' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'HealthSystem', title: 'Health System' },
            { id: 'AssociatedHospital', title: 'Associated Hospital' },
            { id: 'DeletedAt', title: 'Deleted At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateAtriumHealthCholesterolCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const atriumHealthData = await this._ahaNumbersRepo.getAtriumHealthCholesterol();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `Atrium_Health_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, atriumHealthData, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'Plancode', title: 'Plan Code' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'HealthSystem', title: 'Health System' },
            { id: 'AssociatedHospital', title: 'Associated Hospital' },
            { id: 'DeletedAt', title: 'Deleted At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateKaiserPermanenteCholesterolCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const kaiserPermanenteData = await this._ahaNumbersRepo.getKaiserPermanenteCholesterol();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `Kaiser_Permanente_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, kaiserPermanenteData, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'Plancode', title: 'Plan Code' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'HealthSystem', title: 'Health System' },
            { id: 'AssociatedHospital', title: 'Associated Hospital' },
            { id: 'DeletedAt', title: 'Deleted At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateNebraskaHealthSystemCholesterolCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const nebraskaHealthSystemData = await this._ahaNumbersRepo.getNebraskaHealthSystemCholesterol();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `Nebraska_Health_System_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, nebraskaHealthSystemData, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'Plancode', title: 'Plan Code' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'HealthSystem', title: 'Health System' },
            { id: 'AssociatedHospital', title: 'Associated Hospital' },
            { id: 'DeletedAt', title: 'Deleted At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async generateHCAHealthcareCholesterolCsv(): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const hcaHealthcareData = await this._ahaNumbersRepo.getHCAHealthcareCholesterol();
        
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const fileName = `HCA_Healthcare_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
        
        const tempDir = ConfigurationManager.UploadTemporaryFolder();
        const dateSubFolder = path.join(tempDir, dateFolder);
        await fs.promises.mkdir(dateSubFolder, { recursive: true });
        const localFilePath = path.join(dateSubFolder, fileName);
        
        await this.writeCsvFile(localFilePath, hcaHealthcareData, [
            { id: 'PatientUserId', title: 'Patient User ID' },
            { id: 'Phone', title: 'Phone' },
            { id: 'FirstName', title: 'First Name' },
            { id: 'LastName', title: 'Last Name' },
            { id: 'Plancode', title: 'Plan Code' },
            { id: 'StartDate', title: 'Start Date' },
            { id: 'EndDate', title: 'End Date' },
            { id: 'HealthSystem', title: 'Health System' },
            { id: 'AssociatedHospital', title: 'Associated Hospital' },
            { id: 'DeletedAt', title: 'Deleted At' }
        ]);
        
        const uploadedStorageKey = await this._storageService.upload(storageKey, localFilePath);
        
        generatedFilePaths.push(uploadedStorageKey);
        return generatedFilePaths;
    }

    private async writeCsvFile(filePath: string, data: any[], headers: any[]): Promise<void> {
        const csvWriter = createObjectCsvWriter({
            path   : filePath,
            header : headers
        });
        await csvWriter.writeRecords(data);
    }

    private async findLatestDateFolder(): Promise<string | null> {
        try {
            const today = new Date();
            let daysBack = 0;
            
            while (daysBack < 1000) {
                const checkDate = new Date(today);
                checkDate.setDate(today.getDate() - daysBack);
                const dateFolder = TimeHelper.getDateString(checkDate, DateStringFormat.YYYY_MM_DD);
                const basePath = `ahanumbers/${dateFolder}`;
                
                const hasFiles = await this.checkDateFolderHasFiles(basePath);
                if (hasFiles) {
                    Logger.instance().log(`Found files in date folder: ${dateFolder} (${daysBack} days back)`);
                    return dateFolder;
                }
                
                daysBack++;
            }
            
            Logger.instance().log(`No CSV files found in any date folder`);
            return null;
        } catch (error) {
            Logger.instance().log(`Error finding latest date folder: ${error.message}`);
            return null;
        }
    }

    private async checkDateFolderHasFiles(basePath: string): Promise<boolean> {
        const possibleFiles = [
            'Cholesterol_Real_Active.csv',
            'Cholesterol_Real_Deleted.csv',
            'Stroke_Real_Active.csv',
            'Stroke_Real_Deleted.csv',
            'Wellstar_Health_System_Cholesterol.csv',
            'UC_San_Diego_Health_Cholesterol.csv',
            'M_Health_Fairview_Cholesterol.csv',
            'Atrium_Health_Cholesterol.csv',
            'Kaiser_Permanente_Cholesterol.csv',
            'Nebraska_Health_System_Cholesterol.csv',
            'HCA_Healthcare_Cholesterol.csv'
        ];

        for (const fileName of possibleFiles) {
            const storageKey = `${basePath}/${fileName}`;
            try {
                const exists = await this._storageService.exists(storageKey);
                if (exists) {
                    return true;
                }
            } catch (error) {
                continue;
            }
        }
        
        return false;
    }

    public downloadLatestDateFolder = async (): Promise<{
        success: boolean;
        message: string;
        data: {
            zipFileName: string;
            zipBuffer: Buffer;
            downloadUrl: string;
            fileSize: number;
            filesCount: number;
            dateFolder: string;
        };
    }> => {
        const latestDateFolder = await this.findLatestDateFolder();
        
        if (!latestDateFolder) {
            return {
                success : false,
                message : 'No CSV files found in any date folder',
                data    : {
                    zipFileName : '',
                    zipBuffer   : Buffer.alloc(0),
                    downloadUrl : '',
                    fileSize    : 0,
                    filesCount  : 0,
                    dateFolder  : ''
                }
            };
        }

        const basePath = `ahanumbers/${latestDateFolder}`;
        Logger.instance().log(`Found latest date folder: ${latestDateFolder}`);
        
        const possibleFiles = [
            'Cholesterol_Real_Active.csv',
            'Cholesterol_Real_Deleted.csv',
            'Stroke_Real_Active.csv',
            'Stroke_Real_Deleted.csv',
            'Wellstar_Health_System_Cholesterol.csv',
            'UC_San_Diego_Health_Cholesterol.csv',
            'M_Health_Fairview_Cholesterol.csv',
            'Atrium_Health_Cholesterol.csv',
            'Kaiser_Permanente_Cholesterol.csv',
            'Nebraska_Health_System_Cholesterol.csv',
            'HCA_Healthcare_Cholesterol.csv'
        ];

        const tempDir = ConfigurationManager.DownloadTemporaryFolder();
        const dateFolderPath = path.join(tempDir, latestDateFolder);
        
        await fs.promises.mkdir(dateFolderPath, { recursive: true });
        Logger.instance().log(`Created temp directory: ${dateFolderPath}`);

        let filesAdded = 0;

        for (const fileName of possibleFiles) {
            const storageKey = `${basePath}/${fileName}`;
            try {
                Logger.instance().log(`Checking if file exists: ${storageKey}`);
                const exists = await this._storageService.exists(storageKey);
                Logger.instance().log(`File ${fileName} exists: ${exists !== null}`);
                
                if (exists) {
                    const tempFilePath = path.join(dateFolderPath, fileName);
                    await this._storageService.download(storageKey, tempFilePath);
                    
                    filesAdded++;
                    Logger.instance().log(`Downloaded to temp folder: ${tempFilePath}`);
                }
            } catch (error) {
                Logger.instance().log(`Error processing file ${fileName}: ${error.message}`);
            }
        }
        
        Logger.instance().log(`Total files downloaded to temp folder: ${filesAdded}`);

        if (filesAdded === 0) {
            return {
                success : false,
                message : `No CSV files found in date folder: ${latestDateFolder}`,
                data    : {
                    zipFileName : '',
                    zipBuffer   : Buffer.alloc(0),
                    downloadUrl : '',
                    fileSize    : 0,
                    filesCount  : 0,
                    dateFolder  : latestDateFolder
                }
            };
        }

        const zip = new AdmZip();
        zip.addLocalFolder(dateFolderPath, latestDateFolder);
        
        const zipFileName = `aha-numbers-${latestDateFolder}.zip`;
        const zipBuffer = zip.toBuffer();
        
        const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
        const downloadUrl = `${baseUrl}/api/v1/statistics/aha-numbers/download`;
        
        Logger.instance().log(`ZIP file created with size: ${zipBuffer.length} bytes from temp folder: ${dateFolderPath}`);

        return {
            success : true,
            message : `AHA Numbers ZIP file created successfully with ${filesAdded} CSV files from ${latestDateFolder}`,
            data    : {
                zipFileName : zipFileName,
                zipBuffer   : zipBuffer,
                downloadUrl : downloadUrl,
                fileSize    : zipBuffer.length,
                filesCount  : filesAdded,
                dateFolder  : latestDateFolder
            }
        };
    };

}
