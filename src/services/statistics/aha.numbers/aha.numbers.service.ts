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
            const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
            const tempDir = ConfigurationManager.UploadTemporaryFolder();
            const dateSubFolder = path.join(tempDir, dateFolder);
            await fs.promises.mkdir(dateSubFolder, { recursive: true });
            
            await Promise.all([
                this.generateCholesterolActiveCsv(dateFolder, dateSubFolder),
                this.generateCholesterolDeletedCsv(dateFolder, dateSubFolder),
                this.generateStrokeActiveCsv(dateFolder, dateSubFolder),
                this.generateStrokeDeletedCsv(dateFolder, dateSubFolder),
                this.generateWellstarCholesterolCsv(dateFolder, dateSubFolder),
                this.generateUCSanDiegoCholesterolCsv(dateFolder, dateSubFolder),
                this.generateMHealthFairviewCholesterolCsv(dateFolder, dateSubFolder),
                this.generateAtriumHealthCholesterolCsv(dateFolder, dateSubFolder),
                this.generateKaiserPermanenteCholesterolCsv(dateFolder, dateSubFolder),
                this.generateNebraskaHealthSystemCholesterolCsv(dateFolder, dateSubFolder),
                this.generateHCAHealthcareCholesterolCsv(dateFolder, dateSubFolder)
            ]);
            
        } catch (error) {
            Logger.instance().log(`Error in CSV generation: ${JSON.stringify(error.message, null, 2)}`);
            throw error;
        }
    };

    private async generateCholesterolActiveCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const cholesterolActive = await this._ahaNumbersRepo.getCholesterolActive();
        
        const fileName = `Cholesterol_Real_Active.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateCholesterolDeletedCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const cholesterolDeleted = await this._ahaNumbersRepo.getCholesterolDeleted();
        
        const fileName = `Cholesterol_Real_Deleted.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateStrokeActiveCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const strokeActive = await this._ahaNumbersRepo.getStrokeActive();
        
        const fileName = `Stroke_Real_Active.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateStrokeDeletedCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const strokeDeleted = await this._ahaNumbersRepo.getStrokeDeleted();
        
        const fileName = `Stroke_Real_Deleted.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateWellstarCholesterolCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const wellstarData = await this._ahaNumbersRepo.getWellstarCholesterol();
        
        const fileName = `Wellstar_Health_System_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateUCSanDiegoCholesterolCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const ucSanDiegoData = await this._ahaNumbersRepo.getUCSanDiegoCholesterol();
        
        const fileName = `UC_San_Diego_Health_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateMHealthFairviewCholesterolCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const mHealthFairviewData = await this._ahaNumbersRepo.getMHealthFairviewCholesterol();
        
        const fileName = `M_Health_Fairview_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateAtriumHealthCholesterolCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const atriumHealthData = await this._ahaNumbersRepo.getAtriumHealthCholesterol();
        
        const fileName = `Atrium_Health_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateKaiserPermanenteCholesterolCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const kaiserPermanenteData = await this._ahaNumbersRepo.getKaiserPermanenteCholesterol();
        
        const fileName = `Kaiser_Permanente_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateNebraskaHealthSystemCholesterolCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const nebraskaHealthSystemData = await this._ahaNumbersRepo.getNebraskaHealthSystemCholesterol();
        
        const fileName = `Nebraska_Health_System_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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

    private async generateHCAHealthcareCholesterolCsv(dateFolder: string, dateSubFolder: string): Promise<string[]> {
        const generatedFilePaths: string[] = [];
        
        const hcaHealthcareData = await this._ahaNumbersRepo.getHCAHealthcareCholesterol();
        
        const fileName = `HCA_Healthcare_Cholesterol.csv`;
        const storageKey = `ahanumbers/${dateFolder}/${fileName}`;
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
            const todayFolder = TimeHelper.getDateString(today, DateStringFormat.YYYY_MM_DD);
            
            Logger.instance().log(`Checking for today's folder: ${todayFolder}`);
            
            const todayPath = `ahanumbers/${todayFolder}/`;
            const todayHasFiles = await this.checkDateFolderExists(todayPath);
            
            if (todayHasFiles) {
                Logger.instance().log(`Found today's folder: ${todayFolder}`);
                return todayFolder;
            }
            
            Logger.instance().log(`Today's folder not found: ${todayFolder}`);
            return null;
        } catch (error) {
            Logger.instance().log(`Error checking folder: ${error.message}`);
            return null;
        }
    }

    private readonly CSV_FILENAMES = [
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

    private async checkDateFolderExists(basePath: string): Promise<boolean> {
        try {
            const firstFile = this.CSV_FILENAMES[0];
            const storageKey = `${basePath}${firstFile}`;
            const exists = await this._storageService.exists(storageKey);
            
            Logger.instance().log(`Folder check for ${basePath}: ${exists ? 'FOUND' : 'NOT FOUND'}`);
            return exists !== null;
        } catch (error) {
            Logger.instance().log(`Error checking folder ${basePath}: ${error.message}`);
            return false;
        }
    }

    private async getActualFilesInFolder(basePath: string): Promise<string[]> {
        try {
            const existingFiles: string[] = [];
            
            for (const filename of this.CSV_FILENAMES) {
                const storageKey = `${basePath}${filename}`;
                const exists = await this._storageService.exists(storageKey);
                if (exists) {
                    existingFiles.push(filename);
                }
            }
            
            Logger.instance().log(`Found ${existingFiles.length} CSV files in ${basePath}: ${existingFiles.join(', ')}`);
            return existingFiles;
        } catch (error) {
            Logger.instance().log(`Error checking files in ${basePath}: ${error.message}`);
            return [];
        }
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
        try {
            const foundFolder = await this.findLatestDateFolder();
            
            if (!foundFolder) {
                const today = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
                
                return {
                    success : false,
                    message : `No CSV files found for today (${today}). Please upload the files first by triggering the generate endpoint, then try again.`,
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

            const basePath = `ahanumbers/${foundFolder}/`;
            Logger.instance().log(`Processing today's folder: ${foundFolder}`);
            
            const actualFiles = await this.getActualFilesInFolder(basePath);
            
            if (actualFiles.length === 0) {
                return {
                    success : false,
                    message : `Folder exists but no CSV files found for today (${foundFolder}). Please generate the files first, then try again.`,
                    data    : {
                        zipFileName : '',
                        zipBuffer   : Buffer.alloc(0),
                        downloadUrl : '',
                        fileSize    : 0,
                        filesCount  : 0,
                        dateFolder  : foundFolder
                    }
                };
            }

            const tempDir = ConfigurationManager.DownloadTemporaryFolder();
            const dateFolderPath = path.join(tempDir, foundFolder);
            
            try {
                await fs.promises.mkdir(dateFolderPath, { recursive: true });
                Logger.instance().log(`Created temp directory: ${dateFolderPath}`);
            } catch (error) {
                Logger.instance().log(`Error creating temp directory: ${error.message}`);
                throw new Error(`Failed to create temporary directory: ${error.message}`);
            }

            let filesAdded = 0;
            const downloadErrors: string[] = [];

            const downloadPromises = actualFiles.map(async (fileName) => {
                const storageKey = `${basePath}${fileName}`;
                const tempFilePath = path.join(dateFolderPath, fileName);
                
                try {
                    Logger.instance().log(`Downloading file: ${storageKey}`);
                    await this._storageService.download(storageKey, tempFilePath);
                    
                    try {
                        const stats = await fs.promises.stat(tempFilePath);
                        if (!stats.isFile()) {
                            throw new Error('Downloaded path is not a file');
                        }
                        if (stats.size === 0) {
                            throw new Error('Downloaded file is empty (0 bytes)');
                        }
                        Logger.instance().log(`Downloaded successfully: ${tempFilePath} (${stats.size} bytes)`);
                        return { success: true, fileName, error: null };
                    } catch (verifyError) {
                        throw new Error(`File verification failed: ${verifyError.message}`);
                    }
                } catch (error) {
                    const errorMsg = `Error downloading file ${fileName}: ${error.message}`;
                    Logger.instance().log(errorMsg);
                    downloadErrors.push(errorMsg);
                    return { success: false, fileName, error: errorMsg };
                }
            });

            const downloadResults = await Promise.allSettled(downloadPromises);
            
            downloadResults.forEach((result) => {
                if (result.status === 'fulfilled' && result.value.success) {
                    filesAdded++;
                }
            });

            Logger.instance().log(`Total files downloaded: ${filesAdded}/${actualFiles.length}`);
            
            if (downloadErrors.length > 0) {
                Logger.instance().log(`Download errors encountered: ${downloadErrors.length}`);
                downloadErrors.forEach(error => Logger.instance().log(`  - ${error}`));
            }

            if (filesAdded === 0) {
                return {
                    success : false,
                    message : `Failed to download any files from today's folder (${foundFolder}). Check S3 permissions and file accessibility.`,
                    data    : {
                        zipFileName : '',
                        zipBuffer   : Buffer.alloc(0),
                        downloadUrl : '',
                        fileSize    : 0,
                        filesCount  : 0,
                        dateFolder  : foundFolder
                    }
                };
            }

            let zip: AdmZip | null = null;
            let zipBuffer: Buffer | null = null;
            try {
                zip = new AdmZip();
                zip.addLocalFolder(dateFolderPath, foundFolder);
                zipBuffer = zip.toBuffer();
                Logger.instance().log(`ZIP file created with size: ${zipBuffer.length} bytes`);
            } catch (error) {
                Logger.instance().log(`Error creating ZIP file: ${error.message}`);
                throw new Error(`Failed to create ZIP file: ${error.message}`);
            }
            
            const zipFileName = `aha-numbers-${foundFolder}.zip`;
            const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
            const downloadUrl = `${baseUrl}/api/v1/statistics/aha-numbers/download`;

            // Clean up temp directory after successful ZIP creation
            try {
                await fs.promises.rm(dateFolderPath, { recursive: true, force: true });
                Logger.instance().log(`Cleaned up temp directory: ${dateFolderPath}`);
            } catch (error) {
                Logger.instance().log(`Warning: Failed to clean up temp directory: ${error.message}`);
                // Don't throw error for cleanup failure
            }

            const successMessage = filesAdded === actualFiles.length
                ? `AHA Numbers ZIP file created successfully with all ${filesAdded} CSV files from today's folder (${foundFolder})`
                : `AHA Numbers ZIP file created with ${filesAdded}/${actualFiles.length} CSV files from today's folder (${foundFolder}). Some files may have failed to download.`;

            return {
                success : true,
                message : successMessage,
                data    : {
                    zipFileName : zipFileName,
                    zipBuffer   : zipBuffer!,
                    downloadUrl : downloadUrl,
                    fileSize    : zipBuffer!.length,
                    filesCount  : filesAdded,
                    dateFolder  : foundFolder
                }
            };

        } catch (error) {
            Logger.instance().log(`Critical error in downloadLatestDateFolder: ${error.message}`);
            Logger.instance().log(`Error stack: ${error.stack}`);
            
            return {
                success : false,
                message : `An unexpected error occurred while processing the download: ${error.message}`,
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
    };

}
